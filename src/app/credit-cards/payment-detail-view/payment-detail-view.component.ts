import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableConfig } from 'src/app/shared/components/table-advanced';
import { CreditCardService } from 'src/app/shared/services/credit-card.service';
import { DatePipe } from '@angular/common';
import { HeaderService } from 'src/app/shared/services/header.service';
@Component({
  selector: 'app-payment-detail-view',
  templateUrl: './payment-detail-view.component.html',
  styleUrls: ['./payment-detail-view.component.scss']
})
export class PaymentDetailViewComponent {

  lookupname: any;
  lookupcolor: any;
  lookupTextColor: any;

  constructor(private route: ActivatedRoute, 
    private creditcardservice: CreditCardService,
    private headerService: HeaderService,
    public router: Router) {

    const step = this.route.snapshot.queryParamMap.get('ordersCardsCollectionId')
    if (step) {
      this.tableConfig.filter.OrdersCardsCollectionId = step
    }
  }
  ngOnInit(): void {
    this.headerService.setTitle('Credit Cards Payments > Payment Details View');
    this.getdetial()
  }

  data: any
  extractedTime: any
  extractedDate: any
  date1: any
  loading = false;
  tableConfig: TableConfig = {
    paging: true,
    filter: {
    },
  };

  extractedTimesettled:any
  extractedDatesettled:any

  getdetial() {
    this.creditcardservice
      .getCardsCollectionDetial(this.tableConfig.filter)
      .subscribe(result => {
        if (result) {
          this.data = result
          const dateString = result.collectionAt;
          const datetimesettled = result.settledAt
          const date = new Date(dateString);
          const datesettled = new Date(datetimesettled);
          this.extractedDate = date.toLocaleDateString()
          this.extractedTime = date.toLocaleTimeString();
          this.extractedDatesettled = datesettled.toLocaleDateString()
          this.extractedTimesettled = datesettled.toLocaleTimeString();
          this.lookupname=result.statusObj.translations[0].lookupName;
          this.lookupcolor=result.statusObj.lookupBGColor;
          this.lookupTextColor=result.statusObj.lookupTextColor;
        }
      })
      .add(() => (this.loading = false));
  }

  close(){
    this.router.navigate(['credit-card']  );
  }
}
