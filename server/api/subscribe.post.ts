import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  if (!email || !email.includes('@')) {
    throw createError({ statusCode: 400, message: '올바른 이메일을 입력해주세요.' })
  }

  const config = useRuntimeConfig()
  const sql = neon(config.databaseUrl)

  console.log(config.databaseUrl)

  try {
    await sql`
        INSERT INTO email_subscribers (email)
        VALUES (${email})
            ON CONFLICT (email) DO NOTHING
    `
    return { success: true }
  } catch (e) {
    throw createError({ statusCode: 500, message: '서버 오류가 발생했습니다.' })
  }
})
