from odoo import api, models,fields

class Custom(models.Model):
    _name = 'res.custom'
    _rec_name = 'form_name'

    form_name = fields.Char(string="Form Name")
    form_type = fields.Char(string="form Type")