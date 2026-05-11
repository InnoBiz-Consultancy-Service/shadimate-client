/**
 * Chat layout — strips the default bottom padding from ProtectedLayout
 * so the two-panel shell can fill the full remaining viewport.
 *
 * Desktop: AppBar is fixed top (h-16), parent adds md:pt-16 ✓
 * Mobile:  Bottom nav is fixed (h-16), chat should NOT be padded
 *          because the chat room itself is full-screen on mobile.
 */
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * We need to undo the `pb-20 md:pb-0` that ProtectedLayout adds,
   * but we can't remove the parent's className from here directly.
   *
   * Instead we use negative margin + overflow-hidden to cancel the
   * bottom padding, and set exact height so the shell fills correctly.
   *
   * On mobile: -mb-20 cancels parent pb-20, and we let ChatClient
   *            use height: calc(100dvh - 0px) since AppBar is fixed bottom.
   * On desktop: no pb issue (md:pb-0), height: calc(100dvh - 64px).
   */
  return <div className="-mb-20 md:mb-0 overflow-hidden">{children}</div>;
}
