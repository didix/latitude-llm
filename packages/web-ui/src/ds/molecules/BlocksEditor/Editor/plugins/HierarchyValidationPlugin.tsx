import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot, LexicalNode, $isElementNode } from 'lexical'
import { $isMessageBlockNode } from '../nodes/MessageBlock'
import { $isStepBlockNode } from '../nodes/StepBlock'

function $validateAndFixHierarchy(): boolean {
  const root = $getRoot()
  let hasViolations = false

  function validateNode(node: LexicalNode): void {
    if (!$isElementNode(node)) return

    const children = node.getChildren()

    for (const child of children) {
      if ($isMessageBlockNode(node)) {
        if ($isMessageBlockNode(child) || $isStepBlockNode(child)) {
          console.warn(
            '🚨 Hierarchy violation: Message block contains invalid block',
            {
              parent: node.getType(),
              child: child.getType(),
            },
          )
          hasViolations = true
          // Move the child to root level
          child.remove()
          root.append(child)
        }
      } else if ($isStepBlockNode(node)) {
        // Step blocks should not contain other step blocks
        if ($isStepBlockNode(child)) {
          console.warn(
            '🚨 Hierarchy violation: Step block contains step block',
            {
              parent: node.getType(),
              child: child.getType(),
            },
          )
          hasViolations = true
          // Move the child to root level
          child.remove()
          root.append(child)
        }
      }

      // Recursively validate children
      validateNode(child)
    }
  }

  validateNode(root)

  if (hasViolations) {
    console.log(
      '✅ Fixed hierarchy violations - moved invalid nested blocks to root level',
    )
  }

  return hasViolations
}

export function HierarchyValidationPlugin(): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const validateHierarchy = () => {
      editor.update(() => {
        $validateAndFixHierarchy()
      })
    }

    // Run validation on mount
    validateHierarchy()

    const removeListener = editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        editor.update(() => {
          $validateAndFixHierarchy()
        })
      })
    })

    return removeListener
  }, [editor])

  return null
}
