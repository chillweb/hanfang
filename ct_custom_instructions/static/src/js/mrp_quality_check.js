/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { MrpQualityCheckConfirmationDialog } from "@mrp_workorder/mrp_display/dialog/mrp_quality_check_confirmation_dialog";
import { patch } from "@web/core/utils/patch";
import { CharField } from "@web/views/fields/char/char_field";
import { FloatField } from "@web/views/fields/float/float_field";
import { Many2OneField } from "@web/views/fields/many2one/many2one_field";
import { rpc } from "@web/core/network/rpc";
import { onMounted } from "@odoo/owl";
import { useListener } from "@web/core/utils/hooks";




patch(MrpQualityCheckConfirmationDialog, {
    components: {
        ...MrpQualityCheckConfirmationDialog.components,
        CharField,
        FloatField,
        Many2OneField,
    },
});

patch(MrpQualityCheckConfirmationDialog.prototype, {
    
    setup() {
        super.setup();
        console.log('Inside setup()');

        onMounted(() => {
                console.log('Component mounted');

                const totalUnitsElement = document.getElementById('total_units');
                const checkingResult = document.getElementById('checking_result')
                

                if (totalUnitsElement) {

                    totalUnitsElement.addEventListener('change', (event) => {
                        const totalUnitsValue = parseFloat(event.target.value);// Access directly from record data
                        console.log('Total Units:', totalUnitsValue);
                        if (!isNaN(totalUnitsValue)) {
                            this.recordData["three_percent_of_total"] = totalUnitsValue * 0.03;
                        }
                    });
                }


                if(checkingResult){
                    checkingResult.addEventListener('change', (event) =>{
                        const checkingResultValue = parseFloat(event.target.value);
                        const threePercentOfTotalValue = this.recordData["three_percent_of_total"];
                        const finalResult = threePercentOfTotalValue / 3;
                        const statusResultElement = document.getElementById('status_result');
                        
                        if (checkingResultValue >= finalResult){
                            if (statusResultElement) {
                                statusResultElement.textContent = "Fail";
                                statusResultElement.classList.add('btn')
                                statusResultElement.classList.remove("btn-success");
                                statusResultElement.classList.add("btn-danger"); 
                            }  
                        } else if(checkingResultValue < finalResult){
                            if (statusResultElement) {
                                statusResultElement.textContent = "Pass";
                                statusResultElement.classList.add('btn')
                                statusResultElement.classList.remove("btn-danger");
                                statusResultElement.classList.add("btn-success");
                            }
                        } 

                    });
                } 
                
                
            });
    },

    /**
     * @override
     */
    async validate() {
        this.state.disabled = true;
        const seriallotValue = this.props.record.data["serial_number"];
        const totalunitValue = this.props.record.data["total_units"];

        if (this.recordData.test_type === "print_label") {
            return this.doActionAndClose("action_print", false);
        } else if (this.recordData.test_type === "measure") {
            return this.doActionAndClose("do_measure");
        } else if (this.recordData.test_type === "worksheet") {
            return this.doActionAndClose("action_worksheet_check", false);
        } else if (this.recordData.test_type === "Serial number/Lot number") {
            return this.doActionAndClose("action_update_serial_lot_no", false);
        }else if (this.recordData.test_type === "calculus") {
            return this.doActionAndClose("action_update_calculus_data", false);
        }
        const skipSave = ["instructions", "passfail"].includes(this.recordData.test_type);
        await this.doActionAndClose("action_next", !skipSave);
        if (this.recordData.test_type === "register_production"){
            await this.props.record.model.orm.call("mrp.production", "set_qty_producing", [this.recordData.production_id[0]]);
        } else if (this.recordData.test_type === "register_consumed_materials"){
            await this.props.record.model.orm.call("quality.check", "action_update_employee", [this.props.record.resId, this.recordData.worker_id[0], this.recordData.approver_id[0]]);
        }
    },


    async api() {
        
        try {
            // Log that the function has started
            console.log("API call started");
    
            // Make the API call
            const response = await fetch('https://jsonplaceholder.typicode.com/posts/1/comments'); // Example endpoint
    
            // Check if the response is okay
            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }
    
            // Parse the response JSON
            // const data =  await response.json();
            const datas =  await response.json();
    
            // Display the data in the console
            console.log("API Response:", datas);
            // Save data to DB (Example: call a method to update the Odoo model)
            // rpc({
            //     model: 'quality.check',  // Replace with your actual model name
            //     method: 'write',
            //     args: [[this.recordId], { api_response: JSON.stringify(datas) }],
            // });
    
            // Display the results in the shop floor (You can use the template or UI components)
            this.updateStepDisplay(datas);

    
        } catch (error) {
            console.error("Error during API call:", error);
            // this.showNotification({
            //     type: 'danger',
            //     message: `Error during API call: ${error.message}`,
            // });
        }
    },

        // Example method to update the step UI
    updateStepDisplay(datas) {
        // Logic to update the UI with the API response

        // const stepContainer = this.el.querySelector('.step-display-container'); // Add appropriate selector
        // if (stepContainer) {
        // const json_data = JSON.stringify(data, null, 2)
        // $('.step-display-container').text("Rutul");  // Use .text() to set plain text content
        // ('.step-display-container').addClass('Rutul')

        // $('.step-display-container').text(JSON.stringify(data, null, 2))
        // innerHTML = JSON.stringify(data, null, 2); // Beautified JSON display
        // }
        const stepDisplayContainer = document.querySelector('.o_tablet_instruction_note');
        if (stepDisplayContainer) {
            stepDisplayContainer.innerHTML = ''; // Clears previous content
    
            // Check if datas is an array or an object and format it
            if (Array.isArray(datas) || typeof datas === 'object') {
                // If it's an array or object, stringify it in a readable format
                stepDisplayContainer.innerHTML = '<pre>' + JSON.stringify(datas, null, 2) + '</pre>';
            } else {
                // If it's not an object or array, just display it directly
                stepDisplayContainer.innerHTML = datas;
            }
        }
        this.props.record.data.api_data = datas;
        if (this.recordData.test_type === "api") {
            return this.doActionAndClose("store_api_data", false);
        }
        // datas.map((data, index) => {
        //     // Create a new div to hold the content for each data item
        //     const stepElement = document.createElement('div');
        //     stepElement.classList.add('step');  // Add a class for styling, if necessary
    
        //     // Create content for this step element
        //     stepElement.innerHTML = `
        //         <h3>Post ID: ${data.postId} - ID: ${data.id}</h3>
        //         <p><strong>Name:</strong> ${data.name}</p>
        //         <p><strong>Email:</strong> ${data.email}</p>
        //         <p><strong>Body:</strong><br>${data.body}</p>
        //     `;
    
        //     // Append the newly created stepElement to the container
        //     stepDisplayContainer.appendChild(stepElement);
        // });

    },

    /**
     * @override
     */
    async doActionAndClose(action, saveModel = true, reloadChecks = false){
        
        if (saveModel) {
            await this.props.record.save();
        }
        const seriallotValue = this.props.record.data["serial_number"];
        const totalunitValue = this.props.record.data["total_units"];
        const threepercentoftotalValue = this.props.record.data["three_percent_of_total"]
        const checkingResultValue = this.props.record.data["checking_result"];

        if (this.props.record.data["test_type"] == "Serial number/Lot number"){
            const res = await this.props.record.model.orm.call(this.props.record.resModel, action, [this.props.record.resId , seriallotValue]);
            if (res) {
                this.action.doAction(res, {
                    onClose: () => {
                        this.props.reload(this.props.record);
                    },
                });
                if (res.type === "ir.actions.act_window") {
                    this.props.close();
                    return;
                }
            }
            if (!reloadChecks) {
                await this.props.record.load(); 
            }
            await this.props.qualityCheckDone(reloadChecks, this.props.record.data.quality_state);
            this.props.close();
        } else if(this.props.record.data["test_type"] == "calculus"){
            const res = await this.props.record.model.orm.call(this.props.record.resModel, action, [this.props.record.resId , this.props.record.data.total_units, this.props.record.data.three_percent_of_total, this.props.record.data.checking_result]);
            if (res) {
                this.action.doAction(res, {
                    onClose: () => {
                        this.props.reload(this.props.record);
                    },
                });
                if (res.type === "ir.actions.act_window") {
                    this.props.close();
                    return;
                }
            }
            if (!reloadChecks) {
                await this.props.record.load(); 
            }
            await this.props.qualityCheckDone(reloadChecks, this.props.record.data.quality_state);
            this.props.close();
        } else if(this.props.record.data["test_type"] == "api"){
            const res = await this.props.record.model.orm.call(this.props.record.resModel, action, [this.props.record.resId , this.props.record.data.api_data]);
            if (res) {
                this.action.doAction(res, {
                    onClose: () => {
                        this.props.reload(this.props.record);
                    },
                });
                if (res.type === "ir.actions.act_window") {
                    this.props.close();
                    return;
                }
            }
            if (!reloadChecks) {
                await this.props.record.load(); 
            }
            await this.props.qualityCheckDone(reloadChecks, this.props.record.data.quality_state);
        } else{
            const res = await this.props.record.model.orm.call(this.props.record.resModel, action, [this.props.record.resId]);
            if (res) {
                this.action.doAction(res, {
                    onClose: () => {
                        this.props.reload(this.props.record);
                    },
                });
                if (res.type === "ir.actions.act_window") {
                    this.props.close();
                    return;
                }
            }
            if (!reloadChecks) {
                await this.props.record.load();
            }
            await this.props.qualityCheckDone(reloadChecks, this.props.record.data.quality_state);
            this.props.close();
        }
        
    },

    get seriallotInfo() {
        return {
            name: "serial_number",
            record: this.props.record,
        };
    },

    get totalUnits() {
        return {
            name: "total_units",
            record: this.props.record,
        };
    },

    get threePercentOfTotal() {
        return {
            name: "three_percent_of_total",
            record: this.props.record,
        };
    },

    get checkingResult() {
        return {
            name: "checking_result",
            record: this.props.record,
        };
    },

    get workerInfo() {
        return {
            name: "worker_id",
            record: this.props.record,
        }
    },

    get approverInfo() {
        return {
            name: "approver_id",
            record: this.props.record,
        }
    }

});   

