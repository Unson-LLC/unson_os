export interface FormSubmissionResult {
  success: boolean
  message: string
}

export const handleFormSubmission = async (
  formData: FormData,
  type: 'contact' | 'career' | 'support'
): Promise<FormSubmissionResult> => {
  // フォームデータの基本検証
  const requiredFields = getRequiredFields(type)
  for (const field of requiredFields) {
    if (!formData.get(field)) {
      return {
        success: false,
        message: `${field}は必須項目です。`
      }
    }
  }

  // 実際のAPIコールは今後実装
  // 現在はモック応答を返す
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: getSuccessMessage(type)
      })
    }, 1000)
  })
}

const getRequiredFields = (type: string): string[] => {
  const commonFields = ['name', 'email']
  
  switch (type) {
    case 'contact':
      return [...commonFields, 'type', 'message']
    case 'career':
      return [...commonFields, 'position', 'motivation']
    case 'support':
      return [...commonFields, 'type', 'message']
    default:
      return commonFields
  }
}

const getSuccessMessage = (type: string): string => {
  switch (type) {
    case 'contact':
      return 'お問い合わせを受け付けました。24時間以内にご連絡いたします。'
    case 'career':
      return '応募を受け付けました。ご連絡をお待ちください。'
    case 'support':
      return 'お問い合わせを受け付けました。24時間以内にご連絡いたします。'
    default:
      return 'フォームを受け付けました。'
  }
}


export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}