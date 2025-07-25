import { LatitudeError } from '@latitude-data/constants/errors'
import { and, eq } from 'drizzle-orm'
import { DocumentTrigger, Workspace } from '../../browser'
import { database } from '../../client'
import { Result } from '../../lib/Result'
import Transaction, { PromisedResult } from '../../lib/Transaction'
import { documentTriggers } from '../../schema'
import { buildConfiguration } from './helpers/buildConfiguration'
import { DocumentTriggerWithConfiguration } from './helpers/schema'

export async function updateDocumentTriggerConfiguration(
  {
    workspace,
    documentTrigger,
    configuration,
  }: {
    workspace: Workspace
    documentTrigger: DocumentTrigger
    configuration: DocumentTriggerWithConfiguration['configuration']
  },
  db = database,
): PromisedResult<DocumentTrigger> {
  return await Transaction.call(async (tx) => {
    const result = await tx
      .update(documentTriggers)
      .set({
        configuration: buildConfiguration({
          triggerType: documentTrigger.triggerType,
          configuration,
        }),
      })
      .where(
        and(
          eq(documentTriggers.workspaceId, workspace.id),
          eq(documentTriggers.id, documentTrigger.id),
        ),
      )
      .returning()

    if (!result.length) {
      return Result.error(
        new LatitudeError('Failed to update document trigger configuration'),
      )
    }

    return Result.ok(result[0]! as DocumentTrigger)
  }, db)
}
