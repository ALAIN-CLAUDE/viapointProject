import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';


export default class NavigationSubMenu extends NavigationMixin(LightningElement) {
    @api subMenu = {};

    @track href = 'javascript:void(0);';

    /**
     * the PageReference object used by lightning/navigation
     */
    pageReference;

    connectedCallback() {
        console.log('c subMenu',  this.subMenu);
        const { type, target, defaultListViewId } = this.subMenu;
        /*
        if (!target) {
            // NOTE: if actionValue is null for a Salesforce Object menu item, you may not have created
            // the associated page(s) in your LWR site.
            console.log(`WARNING: Navigation menu item target (originally 'actionValue') is missing for menu item:\n ${JSON.stringify(this.item)}\n\nSkipping. Does the target route exist for the site?`);

            // This URL target may be misconfigured, or may be a parent Menu Label item or a Datasource item
            return;
        }*/
        // get the correct PageReference object for the menu item type
       /* if (type === 'InternalLink' || type === 'ExternalLink') {
            // WARNING: Normally you shouldn't use 'standard__webPage' for internal relative targets, but
            // we don't have a way of identifying the PageReference type of an InternalLink URL
            this.pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: target
                }
            };
        }*/

        // use the NavigationMixin from lightning/navigation to generate the URL for navigation. 
        /*if (this.pageReference) {
            this[NavigationMixin.GenerateUrl](this.pageReference)
                .then(url => {
                    this.href = url;
                });
        }*/
    }
   
    get subMenuLabel() {
        return this.subMenu.Label;
    }
 
    handleClick(evt) {       
        evt.stopPropagation();
        evt.preventDefault();
        if (this.pageReference) {
            this[NavigationMixin.Navigate](this.pageReference);
        } else {
            //console.error(`Navigation menu type "${this.item.type}" not implemented for item ${JSON.stringify(this.item)}`);
        }
    }
}