const { createClient } = require("@supabase/supabase-js")

const { supabasePublicKey, supabaseUrl } = process.env

const supabase = createClient(supabaseUrl, supabasePublicKey)

module.exports = supabase
