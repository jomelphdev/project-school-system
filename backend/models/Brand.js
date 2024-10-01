import db from '../config/database.js'

// Get All Brand
export const getAllBrand = (result) => {
  db.query('SELECT * FROM brand', (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}

export const findBrandByDomain = (domain, result) => {
  db.query(
    `SELECT * FROM brand WHERE website_url LIKE '%${domain}%'`,
    [],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
}

// get max search results
export const findBrandMaxLimitByOrgId = (id, result) => {
  db.query(
    'SELECT b.max_search_results FROM brand b JOIN org o ON o.brand_id = b.brand_id WHERE o.org_id = ?',
    [id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results[0])
    }
  )
}

// create brand when creating org
export const insertBrandByOrg = (data, result) => {
  db.query(
    'INSERT INTO brand (flash_text_color,button_text_color, header_bg_color, header_text_color, header_text_size, footer_bg_color, footer_text_color, footer_text_size, brand_name, font, pacifier_text, font_title_size, font_title_color, font_text_size, font_text_color, main_color1, main_color2, main_color3, accent_color1, website_url, website_sender_email, website_contact_email, website_terms_url, website_privacy_url, max_search_results, org_id, suborg_id, brand_path, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, uuid(), NOW(), ?, NOW(), ?)',
    [
      data.flash_text_color,
      data.button_text_color,
      data.header_bg_color,
      data.header_text_color,
      data.header_text_size,
      data.footer_bg_color,
      data.footer_text_color,
      data.footer_text_size,
      data.brand_name,
      data.font,
      data.pacifier_text,
      data.font_title_size,
      data.font_title_color,
      data.font_text_size,
      data.font_text_color,
      data.main_color1,
      data.main_color2,
      data.main_color3,
      data.accent_color1,
      data.website_url,
      data.website_sender_email,
      data.website_contact_email,
      data.website_terms_url,
      data.website_privacy_url,
      data.max_search_results,
      data.org_id,
      data.suborg_id,
      data.created_by,
      data.modified_by,
    ],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    }
  )
}

//? Update Brand by ID
export const updateBrandsById = (id, data, result) => {
  db.query(
    `UPDATE brand 
      SET 
      flash_text_color = ?, 
      button_text_color = ?, 
      header_bg_color = ?, 
      header_text_color = ?, 
      header_text_size = ?, 
      footer_bg_color = ?, 
      footer_text_color = ?, 
      footer_text_size = ?, 
      brand_name = ?, 
      font = ?, 
      pacifier_text = ?, 
      font_title_size = ?, 
      font_title_color = ?, 
      font_text_size  = ?, 
      font_text_color  = ?, 
      main_color1  = ?, 
      main_color2  = ?, 
      main_color3  = ?, 
      accent_color1  = ?, 
      website_url  = ?, 
      website_sender_email  = ?, 
      website_contact_email  = ?, 
      website_terms_url  = ?, 
      website_privacy_url  = ?, 
      max_search_results  = ?, 
      suborg_id  = ?, 
      modified_by = ? 
      WHERE brand_id = ?
    `,
    [
      data.flash_text_color,
      data.button_text_color,
      data.header_bg_color,
      data.header_text_color,
      data.header_text_size,
      data.footer_bg_color,
      data.footer_text_color,
      data.footer_text_size,
      data.brand_name,
      data.font,
      data.pacifier_text,
      data.font_title_size,
      data.font_title_color,
      data.font_text_size,
      data.font_text_color,
      data.main_color1,
      data.main_color2,
      data.main_color3,
      data.accent_color1,
      data.website_url,
      data.website_sender_email,
      data.website_contact_email,
      data.website_terms_url,
      data.website_privacy_url,
      data.max_search_results,
      data.suborg_id,
      data.modified_by,
      id,
    ],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
}

// Get All Brand By Org
export const getAllBrandWithSuborgByOrg = (id, result) => {
  db.query('SELECT * FROM brand b LEFT JOIN suborg s ON b.suborg_id = s.suborg_id WHERE b.org_id = ?', [id], (err, results) => {
    if (err) return result(err, null)
    result(null, results)
  })
}