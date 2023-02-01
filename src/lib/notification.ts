import { Store } from "react-notifications-component";

export class Noti {
  static success(message: string) {
    Store.addNotification({
      message,
      type: "success",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 3000,
      },
    });
  }
  static warning(message: string) {
    Store.addNotification({
      message,
      type: "warning",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 3000,
      },
    });
  }
  static danger(message: string) {
    Store.addNotification({
      title: "Error",
      message: `가격을 업데이트 하지 못했습니다`,
      type: "danger",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 3000,
      },
    });
  }
}
