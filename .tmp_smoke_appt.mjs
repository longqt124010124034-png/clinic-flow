import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
const envText = readFileSync('./.env', 'utf8');
const env = Object.fromEntries(envText.split('\n').filter(Boolean).map(l => { const [k,...r]=l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g,'')]; }));
const admin = createClient(env.SUPABASE_URL, env.sercet, { auth: { persistSession: false } });
const anon = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY);

const { error: signErr } = await anon.auth.signInWithPassword({ email: 'admin@clinicflow.local', password: '8iiR6Llm19ZoAa1!' });
if (signErr) { console.log('signin error', signErr.message); process.exit(1); }

const ORG = '11111111-1111-4111-8111-111111111111';

// 1. seed a doctor employee linked to the 2nd test account, a patient, a service
const { data: doctorUser } = await admin.auth.admin.listUsers();
const secondUser = doctorUser.users.find(u => u.email === 'quachthanhlong2k3@gmail.com');

const { data: emp, error: empErr } = await admin.from('employees').insert({
  organization_id: ORG, user_id: secondUser.id, employee_code: 'BS-SMOKE-01', full_name: 'BS Smoke Test',
  employment_status: 'active', can_receive_appointments: true,
}).select().single();
console.log('employee insert:', empErr ? 'ERROR ' + empErr.message : emp.id);

const { data: pat, error: patErr } = await admin.from('patients').insert({
  organization_id: ORG, patient_code: 'PT-SMOKE-01', full_name: 'Benh Nhan Test', phone: '0900000000', email: 'patient-smoke@example.com',
}).select().single();
console.log('patient insert:', patErr ? 'ERROR ' + patErr.message : pat.id);

const { data: svc, error: svcErr } = await admin.from('services').insert({
  organization_id: ORG, name: 'Kham tong quat', default_duration_minutes: 30,
}).select().single();
console.log('service insert:', svcErr ? 'ERROR ' + svcErr.message : svc.id);

// 2. simulate appointments.booking.tsx doctorsQuery/servicesQuery
const { data: doctors, error: docQErr } = await anon.from('employees').select('id, full_name').eq('employment_status','active').eq('can_receive_appointments', true);
console.log('doctorsQuery (booking page):', docQErr ? 'ERROR ' + docQErr.message : `${doctors.length} row(s)`);

const { data: services, error: svcQErr } = await anon.from('services').select('id, name, default_duration_minutes');
console.log('servicesQuery (booking page):', svcQErr ? 'ERROR ' + svcQErr.message : `${services.length} row(s)`);

// 3. simulate createAppointmentMutation insert exactly like fixed appointments.booking.tsx
const today = new Date().toISOString().split('T')[0];
const { data: apptIns, error: apptInsErr } = await anon.from('appointments').insert({
  organization_id: ORG, patient_id: pat.id, assigned_dentist_id: emp.id,
  appointment_date: today, start_time: '09:00', end_time: '09:30',
  service_id: svc.id, notes: 'smoke test', status: 'scheduled', reminder_sent: false,
}).select();
console.log('appointment insert (booking page):', apptInsErr ? 'ERROR ' + apptInsErr.message : JSON.stringify(apptIns));

// 4. simulate appointments.tsx list query
const { data: listData, error: listErr } = await anon.from('appointments').select('id, appointment_date, start_time, patient:patients(full_name, phone), services(name), status').order('appointment_date',{ascending:false}).order('start_time',{ascending:true});
console.log('appointments.tsx list query:', listErr ? 'ERROR ' + listErr.message : `${listData.length} row(s): ${JSON.stringify(listData[0])}`);

// 5. simulate appointments.calendar.tsx query
const { data: calData, error: calErr } = await anon.from('appointments').select('id, appointment_date, start_time, patient:patients(full_name, phone), services(name), status, notes, reminder_sent').eq('appointment_date', today).order('start_time',{ascending:true});
console.log('appointments.calendar.tsx query:', calErr ? 'ERROR ' + calErr.message : `${calData.length} row(s)`);

// 6. simulate appointments.booking.tsx appointmentsQuery (embed via assigned_dentist_id)
const { data: bookData, error: bookErr } = await anon.from('appointments').select(`
  id, patient_id, assigned_dentist_id, appointment_date, start_time, end_time, status, service_id, notes, reminder_sent,
  patients:patient_id (id, full_name, phone, email),
  employees:assigned_dentist_id (id, full_name),
  services:service_id (id, name, default_duration_minutes)
`).eq('appointment_date', today).order('start_time');
console.log('appointments.booking.tsx appointmentsQuery:', bookErr ? 'ERROR ' + bookErr.message : `${bookData.length} row(s): ${JSON.stringify(bookData[0])}`);
