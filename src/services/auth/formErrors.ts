export type FormErrors = Partial<
  Record<
    | 'email'
    | 'username'
    | 'password'
    | 'confirmPassword'
    | 'oldPassword'
    | 'fullName'
    | 'form',
    string
  >
>;

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Vui lòng nhập email.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
    return 'Email không đúng định dạng.';
  return undefined;
}

const messages: Record<string, string> = {
  emailAlreadyExists: 'Email này đã được đăng ký.',
  usernameAlreadyExists: 'Tên người dùng này đã tồn tại.',
  incorrectPassword: 'Mật khẩu không đúng.',
  incorrectEmailOrPassword: 'Email hoặc mật khẩu không đúng.',
  incorrectOldPassword: 'Mật khẩu hiện tại không đúng.',
  missingOldPassword: 'Vui lòng nhập mật khẩu hiện tại.',
  accountPendingApproval: 'Tài khoản đang chờ quản trị viên duyệt.',
  accountNotActive:
    'Tài khoản chưa được kích hoạt. Vui lòng liên hệ quản trị viên.',
  invalidHash: 'Liên kết đổi mật khẩu không hợp lệ hoặc đã hết hạn.',
};

function readable(value: unknown): string | undefined {
  if (Array.isArray(value))
    return value.map(readable).filter(Boolean).join('\n') || undefined;
  if (typeof value !== 'string' || !value.trim()) return undefined;
  if (messages[value]) return messages[value];
  // Do not expose machine codes or English validator messages as user copy.
  return /[\u00c0-\u1eff]/.test(value) ? value : undefined;
}

export async function getFormErrors(
  error: unknown,
  fallback: string,
): Promise<FormErrors> {
  const response = (error as { response?: Response } | null)?.response;
  if (!response)
    return {
      form:
        readable((error as Error | null)?.message) ??
        'Không kết nối được máy chủ. Vui lòng kiểm tra kết nối và thử lại.',
    };
  try {
    const data = await (
      typeof response.clone === 'function' ? response.clone() : response
    ).json();
    const errors = data?.errors ?? {};
    const result: FormErrors = {};
    for (const field of [
      'email',
      'username',
      'password',
      'oldPassword',
      'fullName',
    ] as const) {
      if (errors[field]) {
        const defaults = {
          email: 'Email không hợp lệ.',
          username: 'Tên người dùng không hợp lệ.',
          password: 'Mật khẩu phải có ít nhất 6 ký tự.',
          oldPassword: 'Mật khẩu hiện tại không đúng.',
          fullName: 'Tên hiển thị không hợp lệ.',
        };
        result[field] =
          errors[field] === 'notFound' && field === 'email'
            ? 'Email hoặc mật khẩu không đúng.'
            : (readable(errors[field]) ?? defaults[field]);
      }
    }
    if (errors.status || errors.hash)
      result.form =
        readable(errors.status ?? errors.hash) ??
        readable(data?.message) ??
        fallback;
    if (!Object.keys(result).length)
      result.form = readable(data?.message) ?? fallback;
    return result;
  } catch {
    return { form: fallback };
  }
}
