export interface MyFestEvent {
  _id?: string;
  name: {
    actual: string;
    themed: string;
  }
  fees: number,
  participants: number;
  registration_fee: number;
  prizemoney: Array<number>;
  rounds: [{
    round: number;    
    name: string;
    qualifying: number;
  }];
  rules: Array<string>;
  eventHeads: [{
    name: string;
    dp: string;
    contact: number;
    
  }], 
  handler: string;
  icon: string;
}

