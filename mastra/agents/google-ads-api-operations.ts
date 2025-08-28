// Google Ads API 操作ビルダー（操作ロジック分離）
import { GOOGLE_ADS_CONFIG, OPTIMIZATION_SAFETY_LIMITS } from '../config/constants'
import { OptimizationAction } from '../types'

export interface ApiOperation {
  entity: string
  operation: string
  resource: any
  update_mask?: string
}

export interface ResourceNameBuilder {
  buildAdGroupCriterionName(customerId: string, adGroupId: string, criterionId: string): string
  buildAdGroupAdName(customerId: string, adGroupId: string, adId: string): string
  buildAdGroupName(customerId: string, adGroupId: string): string
}

export class GoogleAdsApiOperationBuilder {
  private customerId: string
  private resourceBuilder: ResourceNameBuilder

  constructor(customerId: string) {
    this.customerId = customerId
    this.resourceBuilder = new DefaultResourceNameBuilder(customerId)
  }

  buildPauseKeywordOperation(action: OptimizationAction, criterionId: string): ApiOperation {
    const resourceName = this.resourceBuilder.buildAdGroupCriterionName(
      this.customerId, 
      action.adGroupId || '', 
      criterionId
    )

    return {
      entity: GOOGLE_ADS_CONFIG.API_ENTITIES.AD_GROUP_CRITERION,
      operation: GOOGLE_ADS_CONFIG.OPERATIONS.UPDATE,
      resource: {
        resource_name: resourceName,
        status: GOOGLE_ADS_CONFIG.STATUS.PAUSED
      },
      update_mask: GOOGLE_ADS_CONFIG.UPDATE_MASKS.STATUS
    }
  }

  buildBidAdjustmentOperation(action: OptimizationAction, criterionId: string, newBidMicros: number): ApiOperation {
    const resourceName = this.resourceBuilder.buildAdGroupCriterionName(
      this.customerId,
      action.adGroupId || '',
      criterionId
    )

    return {
      entity: GOOGLE_ADS_CONFIG.API_ENTITIES.AD_GROUP_CRITERION,
      operation: GOOGLE_ADS_CONFIG.OPERATIONS.UPDATE,
      resource: {
        resource_name: resourceName,
        cpc_bid_micros: newBidMicros
      },
      update_mask: GOOGLE_ADS_CONFIG.UPDATE_MASKS.CPC_BID_MICROS
    }
  }

  buildCreateAdOperation(action: OptimizationAction): ApiOperation {
    const adGroupResourceName = this.resourceBuilder.buildAdGroupName(
      this.customerId,
      action.adGroupId || ''
    )

    return {
      entity: GOOGLE_ADS_CONFIG.API_ENTITIES.AD_GROUP_AD,
      operation: GOOGLE_ADS_CONFIG.OPERATIONS.CREATE,
      resource: {
        ad_group: adGroupResourceName,
        ad: {
          type: GOOGLE_ADS_CONFIG.AD_TYPES.RESPONSIVE_SEARCH_AD,
          responsive_search_ad: {
            headlines: GOOGLE_ADS_CONFIG.DEFAULT_AD_CONTENT.TEST_HEADLINES,
            descriptions: GOOGLE_ADS_CONFIG.DEFAULT_AD_CONTENT.TEST_DESCRIPTIONS
          }
        },
        status: GOOGLE_ADS_CONFIG.STATUS.ENABLED
      }
    }
  }

  validateBidAdjustment(adjustment: number): { isValid: boolean, error?: string } {
    const maxChange = OPTIMIZATION_SAFETY_LIMITS.MAX_BID_CHANGE_PERCENT / 100
    
    if (Math.abs(adjustment) > maxChange) {
      return {
        isValid: false,
        error: `変更幅 ${(adjustment * 100).toFixed(0)}% が安全制限 ±${OPTIMIZATION_SAFETY_LIMITS.MAX_BID_CHANGE_PERCENT}% を超えています`
      }
    }
    
    return { isValid: true }
  }

  calculateNewBidMicros(currentBidMicros: number, adjustment: number): number {
    const currentBid = currentBidMicros / GOOGLE_ADS_CONFIG.CONVERSION_RATES.MICROS_TO_YEN
    const newBid = currentBid * (1 + adjustment)
    return Math.round(newBid * GOOGLE_ADS_CONFIG.CONVERSION_RATES.MICROS_TO_YEN)
  }
}

export class DefaultResourceNameBuilder implements ResourceNameBuilder {
  constructor(private customerId: string) {}

  buildAdGroupCriterionName(customerId: string, adGroupId: string, criterionId: string): string {
    return `customers/${customerId}/adGroupCriteria/${adGroupId}~${criterionId}`
  }

  buildAdGroupAdName(customerId: string, adGroupId: string, adId: string): string {
    return `customers/${customerId}/adGroupAds/${adGroupId}~${adId}`
  }

  buildAdGroupName(customerId: string, adGroupId: string): string {
    return `customers/${customerId}/adGroups/${adGroupId}`
  }
}