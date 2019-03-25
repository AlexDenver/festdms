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
  description: String;
  rounds: [{
    round: number;    
    name: string;    
    qualifying: number;
    criteria: any
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

