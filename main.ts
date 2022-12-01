import { createSession, getAuthToken } from './create-session.js'

async function run(): Promise<void> {
  try {
    const account = 'cloudab2b'
    const appKey = 'vtexappkey-cloudab2b-EXMKGR'
    const appToken = 'XVPDVCJSGLMCIPDJNMYDVRVEFONUJGDWFXHRFMTYUHNFQZRMZWCNWGRAZBCFGYDQCCLUVNUGVTDCKGAFLUGELRAPMWAXKRLLOXQUTEVQPHAZTFEQTOMMOPFUEUYESSYF'

    const token = await getAuthToken({
      appkey: appKey,
      apptoken: appToken,
      account,
    })

    await createSession(token, account)

  } catch (error) {
    console.log(error)
  }
}

run()