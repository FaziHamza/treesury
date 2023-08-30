import { Injectable } from '@angular/core';
import { DepositService } from './deposit.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  permissions: any = [/* Your permissions data */];

  constructor(private apiService: DepositService) {
    this.apiService.getPermissions(17004).subscribe(res=>{
      if(res.isSuccess){
        this.permissions = res.data;
      }
    })
   }

  checkPermission(catId: number, subCatId: number, permissionItemId: number) {
    if(this.permissions){
      const cat = this.permissions.find((cat: any) => cat.permissionCatId === catId);
      if (!cat) return false;

      const subCat = cat.permissionSubCategories.find((sub: any) => sub.permissionSubCatId === subCatId);
      if (!subCat) return false;

      const item = subCat.permissionItems.find((item: any) => item.permissionItemId === permissionItemId);
      if (!item) return false;

      return item.selected;
    }else{
      return false;
    }

  }
}
