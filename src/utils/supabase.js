const { createClient } = require("@supabase/supabase-js")

const { supabaseKey, supabaseUrl } = process.env

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase
