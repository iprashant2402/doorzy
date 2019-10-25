import { action, observable ,computed} from 'mobx';

class MainStore {
  @observable uid = '';

  @observable user = {};

  @observable phone = '';

  @observable notifications = [];

  @observable cart = [];

  @observable isVisibleNotificationsOverlay = false;

  @observable route = '';

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
    this.cart = this.cart.concat(products);
  }
  
  @action addProductToCart(product){
    this.cart = this.cart.push(product);
  }

  @action alterQuantity(index,inc){
    if(inc){
      this.cart[index].quantity = this.cart[index].quantity + 1;
    }
    else{
      this.cart[index].quantity = this.cart[index].quantity - 1;
    }
  }

  @action resetCart(){
    this.cart = [];
  }

  @action removeItemFromCart(id){
    this.cart = this.cart.filter(item => item.id !== id);
  }

}

export const mainStore = new MainStore();
