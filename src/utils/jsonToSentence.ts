function formatDate(dateObj: any) {
  if (!dateObj || !dateObj.year || !dateObj.month || !dateObj.day) return 'fecha desconocida';
  return `${dateObj.day.low}/${dateObj.month.low}/${dateObj.year.low}`;
}

function jsonToSentence(dataArr: any) {
  if (!Array.isArray(dataArr) || dataArr.length === 0) return 'No se proporcionó información.';

  const data = dataArr[0];

  const traumas = Array.isArray(data.traumas) ? data.traumas.join(', ') : 'No hay traumas reportados';

  const history = data.history || {};
  const work = history.work || 'historial laboral desconocido';
  const friends = history.friends || 'sin información sobre amigos';
  const family = history.family || 'sin información sobre familia';
  const education = history.education || 'sin información educativa';
  const living = history.living || 'sin información sobre lugares donde ha vivido';

  const goodAt = Array.isArray(data.goodAt) ? data.goodAt.join(', ') : 'No hay habilidades listadas';
  const superAt = Array.isArray(data.superAt) ? data.superAt.join(', ') : '';

  const basic = data.basic || {};
  const birthDate = formatDate(basic.date_of_birth);
  const deathDate = formatDate(basic.date_of_death);
  const placeOfBirth = basic.place_of_birth || 'desconocido';
  const height = basic.height || 'desconocido';
  const weight = basic.weight || 'desconocido';
  const eyeColor = basic.eye_color || 'desconocido';
  const skin = basic.skin || 'desconocido';
  const hairColor = basic.hair_color || 'desconocido';
  const hairStyle = basic.hair_style || 'desconocido';
  const glasses = basic.glasses || 'desconocido';
  const race = basic.race || 'desconocido';
  const religion = basic.religion || 'desconocido';
  const animicState = basic.animic_state || 'desconocido';

  const favoriteActivities = Array.isArray(data.favoriteActivities) ? data.favoriteActivities.join(', ') : '';
  const favoriteEnvironments = Array.isArray(data.favoriteEnvironments) ? data.favoriteEnvironments.join(', ') : '';

  const traits = Array.isArray(data.traits)
    ? data.traits.map((t: any) => (t.description ? `${t.name} (${t.description})` : t.name)).join(', ')
    : '';

  return [
    `Ha experimentado traumas como: ${traumas}.`,
    `Su historia incluye trabajos en: ${work}. Tiene como amigos a ${friends} y familiares como ${family}. Su educación fue en ${education}. Ha vivido en ${living}.`,
    `Es bueno en: ${goodAt}.`,
    superAt ? `Además, destaca en: ${superAt}.` : '',
    `Datos básicos: Nació el ${birthDate} en ${placeOfBirth}, y falleció el ${deathDate}. Mide ${height}, pesa ${weight}, tiene ojos ${eyeColor} y piel ${skin}. Su cabello es ${hairColor} y ${hairStyle}. Usa gafas ${glasses}. Es de raza ${race} y religión ${religion}. Estado anímico actual: ${animicState}.`,
    favoriteActivities ? `Sus actividades favoritas son: ${favoriteActivities}.` : '',
    favoriteEnvironments ? `Prefiere ambientes como: ${favoriteEnvironments}.` : '',
    traits ? `Sus rasgos incluyen: ${traits}.` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export default jsonToSentence;
