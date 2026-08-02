# ChatGPT 工作区认证说明

站点可以从请求头读取当前用户的邮箱：`oai-authenticated-user-email`。当工作区配置提供姓名时，还可能收到 `oai-authenticated-user-full-name`；该值是 UTF-8 百分号编码，并会带有 `oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`。

姓名是可选字段，界面应在它缺失时回退到邮箱。实现时使用 `app/chatgpt-auth.ts` 中的现成帮助函数：

- `getChatGPTUser()`：可选登录状态的界面。
- `requireChatGPTUser(returnTo)`：必须登录的服务端页面。
- `chatGPTSignInPath(returnTo)`、`chatGPTSignOutPath(returnTo)`：浏览器中的登录/退出链接。

`returnTo` 只能传入同源的相对路径。依赖身份请求头的页面应导出 `dynamic = "force-dynamic"`，避免把某个用户的状态静态缓存给其他用户。

`/signin-with-chatgpt`、`/signout-with-chatgpt` 和 `/callback` 由托管平台处理，不要在项目中实现同名路由。认证只能确认身份；工作区成员资格仍应由托管平台的访问策略或服务器端的明确规则保证。
