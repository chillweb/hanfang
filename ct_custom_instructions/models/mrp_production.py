from odoo import api, models,fields

class QualityPointTestType(models.Model):
    _inherit = 'mrp.production'

    serial_number = fields.Char(string="Lot/Serial Number", tracking=True)
    total_units = fields.Float(string="Total Manufacturing Units", tracking=True)
    three_percent_of_total = fields.Float(string="3 percent of total manufacturing units")
    checking_result = fields.Float(string="Checking result")
    worker_id = fields.Many2one('hr.employee',string='Employee',domain="""[
            ('employee_type', '=','worker' )]""") 
    approver_id = fields.Many2one('hr.employee',string='Approver',domain="""[
            ('employee_type', '=','worker' )]""")



class MrpWorkorderCustom(models.Model):
    _inherit = 'mrp.workorder'

    serial_number = fields.Char(string="Serial Number", tracking=True)
    total_units = fields.Float(string="Total Manufacturing Units", tracking=True)
    three_percent_of_total = fields.Float(string="3 percent of total manufacturing units") 
    checking_result = fields.Float(string="Checking result")
    status_result = fields.Char(string="status")
    worker_id = fields.Many2one('hr.employee',string='Employee',domain="""[
            ('employee_type', '=','worker' )]""")
    approver_id = fields.Many2one('hr.employee',string='Approver',domain="""[
            ('employee_type', '=','worker' )]""")