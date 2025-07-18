'use server'

import { z } from 'zod'
import { withAdmin } from '../../procedures'
import { toggleWorkspaceFeatureForMultipleWorkspaces } from '@latitude-data/core/services/workspaceFeatures/toggleForMultipleWorkspaces'

export const toggleFeatureForWorkspacesAction = withAdmin
  .createServerAction()
  .input(
    z.object({
      featureId: z.number(),
      workspaceIds: z.array(z.number()),
      enabled: z.boolean(),
    }),
  )
  .handler(async ({ input }) => {
    const result = await toggleWorkspaceFeatureForMultipleWorkspaces(
      input.featureId,
      input.workspaceIds,
      input.enabled,
    )

    return result.unwrap()
  })
