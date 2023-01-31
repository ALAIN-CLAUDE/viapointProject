import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getBaseUrlURL from '@salesforce/apex/NavigationGlobalMenuController.getBaseUrlURL';

export default class NavigationItem extends NavigationMixin(LightningElement) {
    @api item = {};
    @api mainurl;
    @track href = 'javascript:void(0);';
    @track subMenu =[];
    /**
     * the PageReference object used by lightning/navigation
     */
    pageReference;
    isExistSubMenu = false;
    
    connectedCallback() {
        console.log('c nav Item  this.item',  this.item);
        console.log('mainurl', this.mainurl);
        if(this.item.subMenu.length != 0) {
            this.isExistSubMenu = true;
            this.subMenu = this.item.subMenu;
        }
               
        console.log('this.subMenu', this.subMenu);
        const { type, target, defaultListViewId } = this.item;
        /*
        if (!target) {
            // NOTE: if actionValue is null for a Salesforce Object menu item, you may not have created
            // the associated page(s) in your LWR site.
            console.log(`WARNING: Navigation menu item target (originally 'actionValue') is missing for menu item:\n ${JSON.stringify(this.item)}\n\nSkipping. Does the target route exist for the site?`);

            // This URL target may be misconfigured, or may be a parent Menu Label item or a Datasource item
            return;
        }
        if (type === 'MenuLabel') {
            let baseUrl = '/' + this.item.label.toLowerCase();
            console.log(' baseUrl ', baseUrl);
            console.log(' this.item.label ', this.item.label);
            this.pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: baseUrl
                }
            };
        }*/
        // get the correct PageReference object for the menu item type
        if (type === 'InternalLink' || type === 'ExternalLink') {
            // WARNING: Normally you shouldn't use 'standard__webPage' for internal relative targets, but
            // we don't have a way of identifying the PageReference type of an InternalLink URL
            this.pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: target
                }
            };
        }

        // use the NavigationMixin from lightning/navigation to generate the URL for navigation. 
        if (this.pageReference) {
            this[NavigationMixin.GenerateUrl](this.pageReference)
                .then(url => {
                    this.href = url;
                });
        }
    }

    get label() {
        return this.item.label;
    }

    get actionValueLink() {
        let baseUrlURL = getBaseUrlURL();      
        console.log('window.getBaseUrlURL.origin ', baseUrlURL);
        return this.mainurl + this.item.label.toLowerCase();
    }

    showSubMenu(event) {
        let targetId = event.target.dataset.targetId;
        console.log('targetId ', targetId);
        console.log('targetId  event.target',   event.target); 
        console.log('targetId  event.detail',   event.detail);    
        let target = this.template.querySelector(`[data-id="${targetId}"]`);
        const classList = target.classList;
        classList.forEach(element => {
            if (element ==='slds-is-open') {
               classList.remove('slds-is-open');               
            } else {
                classList.add('slds-is-open');                
            }
          })
        //target.classList.remove('slds-hide');
        //target.classList.add('slds-is-open');
        
    }
    handleClick(evt) {       
        evt.stopPropagation();
        evt.preventDefault();
        if (this.pageReference) {
            this[NavigationMixin.Navigate](this.pageReference);
        } else {
            console.error(`Navigation menu type "${this.item.type}" not implemented for item ${JSON.stringify(this.item)}`);
        }
    }
}