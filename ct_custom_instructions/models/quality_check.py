from odoo import api, models,fields
from odoo.exceptions import UserError
from odoo.tools import float_compare, float_round, is_html_empty
import json
import base64

class QualityCheckCustom(models.Model):
    _inherit = 'quality.check'

    serial_number = fields.Char(string="Serial Number", tracking=True)
    total_units = fields.Float(string="Total Manufacturing Units", tracking=True)
    three_percent_of_total = fields.Float(string="3 percent of total manufacturing units")
    checking_result = fields.Float(string="Checking result") 
    status_result = fields.Char(string="status")
    api_data = fields.Text(string="API data", tracking=True)
    worker_id = fields.Many2one('hr.employee',string='Employee',domain="""[
            ('employee_type', '=','worker' )]""")
    approver_id = fields.Many2one('hr.employee',string='Approver',domain="""[
            ('employee_type', '=','worker' )]""")
    

    @api.model
    def action_update_serial_lot_no(self,record_id,seriallot_value):
        record = self.browse(record_id)
        record.workorder_id.current_quality_check_id = record.id
        record.ensure_one()
        record.production_id.serial_number = seriallot_value
        if record.quality_state == 'none':
            record.do_pass()
        record.workorder_id._change_quality_check(position='next')
    
    @api.model
    def action_update_calculus_data(self,record_id,total_unit,three_percent_of_total,checking_result):
        record = self.browse(record_id)
        record.point_id.total_units_manuf = total_unit
        record.point_id.three_percent_of_total = three_percent_of_total
        record.point_id.checking_result = checking_result
        
        if record.quality_state == 'none':
            record.do_pass()
            record.workorder_id._change_quality_check(position='next')

    @api.model
    def action_update_employee(self,record_id,worker_id,approver_id):
        record = self.browse(record_id)
        record.point_id.worker_id = worker_id
        record.point_id.approver_id = approver_id

        if record.quality_state == 'none':
            record.do_pass()
            record.workorder_id._change_quality_check(position='next')

    @api.model
    def store_api_data(self,record_id,values):
        record = self.browse(record_id)
        if isinstance(values, list):
            # Convert the list of dictionaries to JSON string
            json_data = json.dumps(values, indent=2)

            # Create and attach the JSON file
            file_name = f"api_data_{record_id}.json"
            file_content = base64.b64encode(json_data.encode('utf-8'))  # Encode file content to base64

            # Attach the file to the `quality.point` record
            record.point_id.api_data_attachment = file_content
            record.point_id.api_data_attachment_filename = file_name
        
        if record.quality_state == 'none':
            record.do_pass()   
        record.workorder_id._change_quality_check(position='next')     
        
        # if isinstance(values, list):
        #     values = {
        #         'api_data': json.dumps(values, indent=2)  # Convert to JSON string with indentation
        #     }
        # record.api_data = values['api_data']
        # record.point_id.api_data = record.api_data
    
