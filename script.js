
const user = {
  age: 0,
  weight: 0,
  height: 0,
  gender: '',
  activityLevel: '',
  bmi: 0,
  bmr: 0,
  tdee: 0,
  bodyFat: 0,
  goal: 0
};

const calories = {
  cuttingCalories: 0,
  maintainingCalories: 0,
  bulkingCalories: 0,
  cutMaintainProtein: 0,
  bulkProtein: 0,
  fat: 0,
  carbs: 0
};

function calculateBMR(user) {
  if (user.gender === 'male') {
    return 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
  } else {
    return 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
  }
}

function calculateTDEE(user) {
  const bmr = calculateBMR(user);
  let multiplier = 1.25;
  if (user.activityLevel === 'medium') multiplier = 1.55;
  if (user.activityLevel === 'high') multiplier = 1.725;
  return bmr * multiplier;
}

function calculateBMI(user) {
  return user.weight / Math.pow(user.height / 100, 2);
}

function estimateBodyFat(user) {
  const bmi = calculateBMI(user);
  if (user.gender === 'male') {
    return 1.2 * bmi + 0.23 * user.age - 16.2;
  } else {
    return 1.2 * bmi + 0.23 * user.age - 5.4;
  }
}

function calculateMacros(user) {
  user.tdee = calculateTDEE(user);
  switch (user.goal) {
    case 1:
      calories.cuttingCalories = user.tdee - 300;
      calories.cutMaintainProtein = 2 * user.weight;
      calories.fat = calories.cuttingCalories * 0.25;
      calories.carbs = calories.cuttingCalories - (calories.fat + calories.cutMaintainProtein);
      break;
    case 2:
      calories.maintainingCalories = user.tdee;
      calories.cutMaintainProtein = 2 * user.weight;
      calories.fat = calories.maintainingCalories * 0.25;
      calories.carbs = calories.maintainingCalories - (calories.fat + calories.cutMaintainProtein);
      break;
    case 3:
      calories.bulkingCalories = user.tdee + 300;
      calories.bulkProtein = 1.6 * user.weight;
      calories.fat = calories.bulkingCalories * 0.25;
      calories.carbs = calories.bulkingCalories - (calories.fat + calories.bulkProtein);
      break;
  }
}

const calculateBtn = document.querySelector('.buttona');
const reportBtn = document.querySelector('.report');
const resultsDiv = document.getElementById('results');

calculateBtn.addEventListener('click', () => {
  user.age = parseInt(document.getElementById('age').value);
  user.weight = parseFloat(document.getElementById('weight').value);
  user.height = parseFloat(document.getElementById('height').value);
  const genderSelected = document.querySelector('input[name="gender"]:checked');
  const activitySelected = document.querySelector('input[name="activityLevel"]:checked');

  if (!user.age || !user.weight || !user.height || !genderSelected || !activitySelected) {
    alert('Please fill all fields and select gender & activity level');
    return;
  }

  user.gender = genderSelected.value;
  user.activityLevel = activitySelected.value;

  user.bmi = calculateBMI(user);
  user.bmr = calculateBMR(user);
  user.tdee = calculateTDEE(user);
  user.bodyFat = estimateBodyFat(user);

  resultsDiv.innerHTML = `
    <h3>Fitness Results</h3>
    <p>BMI: ${user.bmi.toFixed(2)}</p>
    <p>BMR: ${user.bmr.toFixed(2)} kcal/day</p>
    <p>TDEE: ${user.tdee.toFixed(2)} kcal/day</p>
    <p>Body Fat: ${user.bodyFat.toFixed(2)}%</p>
  `;
});

reportBtn.addEventListener('click', () => {
  const goalInput = prompt('Enter your goal (1 = Cutting, 2 = Maintenance, 3 = Bulking)');
  user.goal = parseInt(goalInput);
  if (![1, 2, 3].includes(user.goal)) {
    alert('Invalid goal number');
    return;
  }

  calculateMacros(user);

  let msg = '';
  if (user.goal === 1) {
    msg = `
      <h3>Cutting Plan</h3>
      <p>Calories: ${calories.cuttingCalories.toFixed(2)}</p>
      <p>Protein: ${calories.cutMaintainProtein.toFixed(2)} g</p>
      <p>Carbs: ${calories.carbs.toFixed(2)} g</p>
      <p>Fat: ${calories.fat.toFixed(2)} g</p>
    `;
  } else if (user.goal === 2) {
    msg = `
      <h3>Maintenance Plan</h3>
      <p>Calories: ${calories.maintainingCalories.toFixed(2)}</p>
      <p>Protein: ${calories.cutMaintainProtein.toFixed(2)} g</p>
      <p>Carbs: ${calories.carbs.toFixed(2)} g</p>
      <p>Fat: ${calories.fat.toFixed(2)} g</p>
    `;
  } else {
    msg = `
      <h3>Bulking Plan</h3>
      <p>Calories: ${calories.bulkingCalories.toFixed(2)}</p>
      <p>Protein: ${calories.bulkProtein.toFixed(2)} g</p>
      <p>Carbs: ${calories.carbs.toFixed(2)} g</p>
      <p>Fat: ${calories.fat.toFixed(2)} g</p>
    `;
  }

  resultsDiv.innerHTML = msg;
});