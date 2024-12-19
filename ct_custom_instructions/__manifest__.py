# -*- coding: utf-8 -*-
{
    'name': "Custom Instructions",

    'summary': "Custom Instructions",

    'description': """
    Custom Instructions
    """,

    'author': "My Company",
    'website': "https://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': [
        'web_enterprise',  
        'mrp' ,      
        'web_mobile' ,'quality'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
        'views/res_custom_view.xml',
        'views/mrp_inherit_view.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'ct_custom_instructions/static/src/js/shop_floor.js',
            'ct_custom_instructions/static/src/js/mrp_quality_check.js',
            'ct_custom_instructions/static/src/mrp_display/shop_floor_template.xml',
        ],
    },
}

