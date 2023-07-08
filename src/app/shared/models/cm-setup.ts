export class CmSetup {
  id: number;
  periodBetweenPNType: string;
  periodBetweenPNValue: number;
  overDueAlertType: string;
  overDueAlertTypeValue: number;
  managePNWithin: string;
  createdBy: any;
  createdAt: any;
  modifiedBy: number;
  modifiedAt: string;

  constructor(data: any) {
    this.id = data?.id;
    this.periodBetweenPNType = data?.periodBetweenPNType;
    this.periodBetweenPNValue = data?.periodBetweenPNType;
    this.overDueAlertType = data?.overDueAlertType;
    this.overDueAlertTypeValue = data?.overDueAlertTypeValue;
    this.managePNWithin = data?.managePNWithin;
    this.createdBy = data?.createdBy;
    this.createdAt = data?.createdAt;
    this.modifiedBy = data?.modifiedBy;
    this.modifiedAt = data?.modifiedAt;
  }
}
