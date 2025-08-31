import { NextResponse } from 'next/server'
import { getUserOrgs } from '@/modules/organizations/actions'

export async function GET() {
  try {
    const data = await getUserOrgs()
    return NextResponse.json({ data })
  } catch (err) {
    console.error('GET /api/test/get-user-orgs error', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}


