fetch('https://sqvkcfndmravgutbusat.supabase.co/rest/v1/glucose_readings', {
  headers: {
    apikey: 'sb_publishable_OTyI1atHjM1BzgznHU9JoQ_p_pDnKru'
  }
}).then(res => console.log('Status:', res.status))
  .catch(err => console.error('Error:', err));
