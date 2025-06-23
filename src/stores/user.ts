import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import type { UserInfo, InviteCode, InviteCodeResult } from '@/types'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({
    ip: '199.168.1.100',
    location: '中国北京',
    dailyQuota: 10,
    remainingQuota: 5,
    isVipUser: false
  })

  const inviteCodeAttempts = ref(0)
  const maxAttempts = 5
  const isBlocked = ref(false)

  // 模拟邀请码数据库
  const inviteCodes: InviteCode[] = [
    {
      code: 'VIP50',
      quota: 50,
      description: 'VIP会员 - 每日50个流量包',
      isActive: true
    },
    {
      code: 'VIP100',
      quota: 100,
      description: 'VIP高级会员 - 每日100个流量包',
      isActive: true
    },
    {
      code: 'VIP200',
      quota: 200,
      description: 'VIP至尊会员 - 每日200个流量包',
      isActive: true
    },
    {
      code: 'DEMO20',
      quota: 20,
      description: '体验会员 - 每日20个流量包',
      isActive: true
    },
    {
      code: 'STUDENT30',
      quota: 30,
      description: '学生优惠 - 每日30个流量包',
      isActive: true
    }
  ]

  const applyInviteCode = (code: string): InviteCodeResult => {
    if (isBlocked.value) {
      return {
        success: false,
        message: '您已被禁止访问24小时，请稍后再试'
      }
    }

    if (code.trim() === '') {
      return {
        success: false,
        message: '请输入邀请码'
      }
    }

    // 查找匹配的邀请码
    const foundCode = inviteCodes.find(invite => 
      invite.code === code.toUpperCase() && invite.isActive
    )

    if (foundCode) {
      // 只有当新额度大于当前额度时才允许升级
      if (foundCode.quota > userInfo.value.dailyQuota) {
        const oldQuota = userInfo.value.dailyQuota
        userInfo.value.dailyQuota = foundCode.quota
        userInfo.value.isVipUser = true
        inviteCodeAttempts.value = 0
        
        return {
          success: true,
          message: `邀请码验证成功！您的每日额度已从${oldQuota}个提升至${foundCode.quota}个`,
          quota: foundCode.quota,
          description: foundCode.description
        }
      } else {
        return {
          success: false,
          message: `当前额度(${userInfo.value.dailyQuota})已高于或等于该邀请码提供的额度(${foundCode.quota})`
        }
      }
    } else {
      inviteCodeAttempts.value++
      if (inviteCodeAttempts.value >= maxAttempts) {
        isBlocked.value = true
        // 24小时后自动解封
        setTimeout(() => {
          isBlocked.value = false
          inviteCodeAttempts.value = 0
        }, 24 * 60 * 60 * 1000)
        return {
          success: false,
          message: '连续5次输入错误，您已被禁止访问24小时'
        }
      }
      return {
        success: false,
        message: `邀请码无效或已过期，还剩${maxAttempts - inviteCodeAttempts.value}次机会`
      }
    }
  }

  const consumeQuota = () => {
    if (userInfo.value.remainingQuota > 0) {
      userInfo.value.remainingQuota--
      return true
    }
    return false
  }

  // 获取可用的邀请码列表（仅用于开发/测试）
  const getAvailableInviteCodes = () => {
    return inviteCodes.filter(code => code.isActive)
  }

  return {
    userInfo: readonly(userInfo),
    inviteCodeAttempts: readonly(inviteCodeAttempts),
    isBlocked: readonly(isBlocked),
    applyInviteCode,
    consumeQuota,
    getAvailableInviteCodes
  }
}) 