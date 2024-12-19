from odoo import api, models,fields

class QualityPointTestType(models.Model):
    _inherit = 'quality.point.test_type'


    @api.model
    def create_custom_test_type(self):
        # Check if 'Custom' already exists to avoid duplicates
        if not self.env['quality.point.test_type'].search([('name', '=', 'Serial number/Lot number')]):
            self.env['quality.point.test_type'].create({
                'name': 'Serial number/Lot number',
                'technical_name' : 'Serial number/Lot number'
            })
        if not self.env['quality.point.test_type'].search([('technical_name', '=', 'api')]):
            self.env['quality.point.test_type'].create({
                'name': 'API',
                'technical_name' : 'api'
            }) 
        if not self.env['quality.point.test_type'].search([('technical_name', '=', 'calculus')]):
            self.env['quality.point.test_type'].create({
                'name': 'Calculus',
                'technical_name' : 'calculus'
            })        



class QualityPointInherit(models.Model):
    _inherit = 'quality.point'

    form_name_id = fields.Many2one('res.custom',string="Form Name")


