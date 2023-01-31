import { LightningElement, track, wire, api } from 'lwc';
import getUserTimeZone from '@salesforce/apex/cpCardPurchasedProducts.getUserTimeZone';
import getAllOrdersAndItems from '@salesforce/apex/cpCardPurchasedProducts.getAllOrdersAndItems';
import { refreshApex } from "@salesforce/apex";
import basePath from "@salesforce/community/basePath";
import ISO_AS_9000_LOGO from '@salesforce/resourceUrl/IsoAs9000';
import ISO_AS_16949_LOGO from '@salesforce/resourceUrl/IsoAs16949';
import ISO_AS_13485_LOGO from '@salesforce/resourceUrl/IsoAS13485';
import ISO_AS_14001_LOGO from '@salesforce/resourceUrl/IsoAs14001';

import ISO_AS_22301_LOGO from '@salesforce/resourceUrl/IsoAs22301';

import ISO_AS_27001_LOGO from '@salesforce/resourceUrl/IsoAs27001';
import ISO_AS_45001_LOGO from '@salesforce/resourceUrl/IsoAs45001';
import ISO_AS_9001_LOGO from '@salesforce/resourceUrl/IsoAs9001';

import ISO_KS_9000_LOGO from '@salesforce/resourceUrl/IsoKs9000';
import ISO_KS_16949_LOGO from '@salesforce/resourceUrl/IsoKsIatf16949';
import ISO_KS_13485_LOGO from '@salesforce/resourceUrl/IsoKs13485';
import ISO_KS_14001_LOGO from '@salesforce/resourceUrl/IsoKs14001';
import ISO_KS_23001_LOGO from '@salesforce/resourceUrl/IsoKs23001';
import ISO_KS_27001_LOGO from '@salesforce/resourceUrl/IsoKs27001';
import ISO_KS_45001_LOGO from '@salesforce/resourceUrl/IsoKs45001';
import ISO_KS_90001_LOGO from '@salesforce/resourceUrl/IsoKs9001';

export default class CpCardPurchasedProducts extends LightningElement {
    @track productData;
    objectApiName='Order';
    data;
    localTimeZone;
    localSidKey;
    timeZoneData;  
    urlProducts = basePath +'/products/purchased-products';
  
    @wire(getUserTimeZone)
    wiredUsers(result) {
        refreshApex(result);
        if (result.data) {            
            let resp  = JSON.parse(JSON.stringify(result.data));
            this.localTimeZone = resp['TimeZoneSidKey'];
            this.localSidKey = resp['LocaleSidKey'];
        }
    }
    
    @wire(getAllOrdersAndItems)
    cons(result) {
        refreshApex(result);
        if(result.data){
            this.productData = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))        
            resp.forEach(item => {               
                item['editLink'] = '/order/' +item['OrderId'];
                item['unitClass'] = item['Order_Status__c'].toLowerCase() +' card-box';
                item['menuId'] = 'menuId'+item['Id'];
                console.log('Product2.ProductCardBackgroundColor__c', item.Product2.ProductCardBackgroundColor__c);
                item['imageLogoCss'] = 'background-color:' + item.Product2.ProductCardBackgroundColor__c;                           
                let local;               
                if(this.localSidKey) {
                    local = this.localSidKey.replace("_", "-");
                }
                let convertFormat = "{DD}/{MM}/{YYYY}";
                if(item['ServiceDate']) {                    
                    let dateStart = Date.parse(item['ServiceDate']);
                    //var noTime = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate());
                    let dateStartVal = new Date(new Date(dateStart).toUTCString());                   
                    //let startDate = (new Date(item['ServiceDate']).toLocaleString(local, {timeZone: timeZone,}));
                    //let startDate = Date.parse(dateStartVal).toLocaleDateString(local);
                    item['formattedStartDate'] = this.convertDateFormat(dateStartVal, convertFormat, local);
                } else {
                    item['formattedStartDate']='';
                }
                if(item['EndDate']){
                    let finishDate = new Date(item['EndDate']).toLocaleDateString(local);
                    item['formattedFinishDate'] = item['EndDate'];
                } else {
                    item['formattedFinishDate'] ='';
                }                
            });
            this.productData = resp;            
        }
        if (result.error) {
            this.productData = undefined;
        }
    }

    convertDateFormat(date, format, location) {
        //location = location.substr(0, location.indexOf('_'));
        let z = {
            M: date.getMonth() + 1,
            D: date.getDate(),
        };
    
        format = format.replace(/{(Y+)}/g, function(v) {
            return date.getFullYear().toString().slice(2 - v.length)
        });
    
        if(format.match(/M{3,}/g)) {
            
            format = format.replace(/({M{4,}})/g, function() {
                return date.toLocaleString( location, { month: 'long' });
            });
    
            format = format.replace(/{M{3}}/g, function() {
                return date.toLocaleString(location, { month: 'short' });
            });
    
        } else {
            format = format.replace(/{(M+)}/g, function(v) {
                return ((v.length > 1 ? "0" : "") + z.M).slice(-2)
            });
        }
    
        format = format.replace(/{(D+)}/g, function(v) {
            return ((v.length > 1 ? "0" : "") + z.D).slice(-2)
        });
        
        return format;
    }

}