/**
 * دریافت و گزارش تغییرات Business Connection.
 *
 * این handler فقط وضعیت اتصال را log می‌کند؛ منطق پاسخ به پیام‌ها
 * در businessMessageHandler قرار دارد تا مسئولیت‌ها از هم جدا بمانند.
 */
export async function handleBusinessConnection(ctx) {
  const connection = ctx.businessConnection;

  if (!connection) {
    console.warn("Business connection update received without connection data.");
    return;
  }

  console.log("Business connection updated:", {
    id: connection.id,
    userId: connection.user.id,
    isEnabled: connection.is_enabled,
    rights: connection.rights
  });

  if (!connection.is_enabled) {
    console.log(`Business connection disabled: ${connection.id}`);
    return;
  }

  if (connection.rights?.can_reply) {
    console.log(`Business connection can reply: ${connection.id}`);
  } else {
    console.log(`Business connection cannot reply: ${connection.id}`);
  }
}
