export async function handleBusinessConnection(ctx) {
  const connection = ctx.businessConnection;

  if (!connection) {
    return;
  }

  console.log("Business connection updated:");

  console.log({
    id: connection.id,
    userId: connection.user.id,
    isEnabled: connection.is_enabled,
    rights: connection.rights
  });

  if (!connection.is_enabled) {
    console.log(
      `Business connection disabled: ${connection.id}`
    );

    return;
  }

  if (connection.rights?.can_reply) {
    console.log(
      `Business connection can reply: ${connection.id}`
    );
  } else {
    console.log(
      `Business connection cannot reply: ${connection.id}`
    );
  }
}
