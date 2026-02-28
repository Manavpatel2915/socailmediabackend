import db from '../config/databases/sqldbconnnect';

const notificationget = async (
  user_id: number
) => {
  const notification = await db.Notification.findAll({
    where: {
      notification_owner_id: user_id
    },
    attributes: {
      exclude: ['notification_id', 'is_read']
    }
  })
  return notification;
}

const createNotification = async (
  notification_owner: number,
  created_by_user: number,
  title: string,
  message: string
) => {
  await db.Notification.create({
    notification_owner_id: notification_owner,
    created_by_user_id: created_by_user,
    title: title,
    message: message,
    is_read: false,
  });
}

export {
  notificationget,
  createNotification
}