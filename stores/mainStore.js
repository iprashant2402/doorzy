import { action, observable ,computed} from 'mobx';

class MainStore {
  @observable uid = '';

  @observable user = {};

  @observable phone = '';

  @observable notifications = [];

  @observable cart = [];

  @observable isVisibleNotificationsOverlay = false;

  @observable route = 'MyAccountScreen';

  @observable selectedOutlet = {};

  @computed get cartCount() {
    return this.cart.length;
  }

  @computed get notificationCount() {
    var unreadArray = this.notifications.filter((item)=>item.read==false);
    return unreadArray.length;
  }


  @action setRoute(routeName){
    this.route = routeName;
  }

  @action setPhoneNumber(phone){
    this.phone = phone;
  }

  @action toggleNotificationOverlay(){
    this.isVisibleNotificationsOverlay = !this.isVisibleNotificationsOverlay;
  }

  @action setUid(newUid) {
    //console.log("STORE.JS : inside setProperty : " + newProperty);
    this.uid = newUid;
    //console.log("STORE.JS : SUCCESS : "+ this.property);
  }

  @action setUser(user){
      this.user = user;
  }

  @action setOutlet(outlet){
    this.selectedOutlet = outlet;
  }

  @action setNotifications(notifs){
    this.notifications = notifs;
  }

  @action setCart(products){
    this.cart = products
  }
}

export const mainStore = new MainStore();
