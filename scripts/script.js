import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' }); 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  console.log('⏳ Начинаю умное скачивание (Pagination)...');

  const batchSize = 1000; // Скачиваем по 1000 штук
  let offset = 0;
  let allCsvData = '';
  let totalRows = 0;

  while (true) {
    console.log(`   Загрузка с ${offset} по ${offset + batchSize}...`);
    
    const { data, error } = await supabase
      .from('universities')
      .select(
        'id, name, acceptance_rate, min_ielts, min_gpa, min_sat, application_deadline, enrollment_size, international_students_percent'
      )
      .range(offset, offset + batchSize - 1)
      .csv();

    if (error) {
      console.error('❌ Ошибка:', error.message);
      break;
    }

    // Если данных нет или пришел только заголовок (пустая строка/одна строка), выходим
    if (!data || data.length === 0) break;

    const rows = data.split('\n');
    // Если вернулся только заголовок (1 строка), значит данные кончились
    if (rows.length <= 1 && offset > 0) break; 

    if (offset === 0) {
      // ПЕРВЫЙ КУСОК: берем целиком с заголовками
      allCsvData += data;
      totalRows += rows.length - 1; // минус заголовок
    } else {
      // СЛЕДУЮЩИЕ КУСКИ: отрезаем первую строку (заголовки), чтобы они не дублировались
      const cleanData = data.substring(data.indexOf('\n') + 1);
      allCsvData += cleanData; // Иногда нужен \n перед этим, но .csv() обычно дает новую строку
      totalRows += rows.length - 1;
    }

    // Если мы скачали меньше, чем просили (например, просили 1000, а пришло 213), значит это конец
    if (rows.length - 1 < batchSize) {
      break;
    }

    offset += batchSize;
  }

  fs.writeFileSync('universities_full.csv', allCsvData);
  console.log(`✅ Готово! Файл создан. Всего строк данных: ${totalRows}`);
}

run();