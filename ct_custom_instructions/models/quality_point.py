from odoo import api, models,fields
import json
import base64

class QualitypointCustom(models.Model):
    _inherit = 'quality.point'

    api_data = fields.Text(string="API data")
    api_data_attachment = fields.Binary(string="API Data File")
    api_data_attachment_filename = fields.Char(string="File Name")
    total_units_manuf = fields.Float(string="Total manufacturing Units")
    three_percent_of_total = fields.Float(string="3 percent of total manufacturing units") 
    checking_result = fields.Float(string="Checking result")
    status_result = fields.Char(string="status")
    worker_id = fields.Many2one('hr.employee',string='Worker',domain="""[
            ('employee_type', '=','worker' )]""")
    approver_id = fields.Many2one('hr.employee',string='Approver',domain="""[
            ('employee_type', '=','worker' )]""")