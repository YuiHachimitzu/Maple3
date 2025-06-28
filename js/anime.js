// Load data (you can use fetch for data.json or hardcode it)
const data = {
  subjects: {
    math: [
      {
        title: "Algebra Quiz 1",
        type: "quiz",
        description: "Covers linear equations and inequalities.",
        image: "images/math/quiz1.jpg",
        date: "2025-07-01"
      },
      {
        title: "Geometry Notes",
        type: "notes",
        description: "Notes on triangles and circles.",
        image: "images/math/notes1.png",
        date: "2025-06-28"
      }
    ],
    science: [
      {
        title: "Biology Lab Activity",
        type: "activity",
        description: "Cell structure experiment.",
        image: "images/science/activity1.jpg",
        date: "2025-07-05"
      }
    ],
    english: [
      {
        title: "Essay Draft",
        type: "notes",
        description: "Draft for persuasive essay.",
        image: "images/english/draft1.png",
        date: "2025-07-03"
      }
    ]
  },
  pendingAssignments: [
    {
      title: "Math Homework 1",
      subject: "math",
      dueDate: "2025-07-02",
      description: "Complete exercises 1-10 on page 45."
    },
    {
      title: "Science Report",
      subject: "science",
      dueDate: "2025-07-06",
      description: "Write a report on the lab experiment."
    }
  ]
};

const itemListContainer = document.querySelector('.item-list');
const searchInput = document.getElementById('item-search');
const searchBtn = document.getElementById('item-search-btn');
const categoryList = document.querySelectorAll('.categories ul li');
const pendingListContainer = document.querySelector('.pending-list');

// Flatten subjects for easier filtering
const allItems = Object.keys(data.subjects).reduce((acc, subject) => {
  return acc.concat(data.subjects[subject].map(item => ({ ...item, subject })));
}, []);

function renderItemList(items) {
  itemListContainer.innerHTML = '';
  if (items.length === 0) {
    itemListContainer.innerHTML = '<p>No items found.</p>';
    return;
  }
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.style.cursor = 'pointer';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = `${item.title} (${item.type})`;
    img.style.width = '200px';
    img.style.height = 'auto';
    img.onerror = function () {
      this.src = 'https://via.placeholder.com/150?text=No+Image';
    };

    div.addEventListener('click', () => {
      window.location.href = `preview.html?item=${encodeURIComponent(item.title)}`;
    });

    div.appendChild(img);
    itemListContainer.appendChild(div);
  });
}

function renderPendingList() {
  pendingListContainer.innerHTML = '';
  data.pendingAssignments.forEach(assignment => {
    const div = document.createElement('div');
    div.className = 'pending-item';
    div.innerHTML = `
      <h3>${assignment.title}</h3>
      <p>Subject: ${assignment.subject}</p>
      <p>Due: ${assignment.dueDate}</p>
      <p>${assignment.description}</p>
    `;
    pendingListContainer.appendChild(div);
  });
}

// Initial render
renderItemList(allItems);
renderPendingList();

// Search functionality
function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = allItems.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  );
  renderItemList(filtered);
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch();
});

// Category filter functionality
categoryList.forEach(li => {
  li.addEventListener('click', () => {
    const category = li.getAttribute('data-category');
    let filtered;
    if (category === 'all') {
      filtered = allItems;
    } else {
      filtered = allItems.filter(item => item.subject === category);
    }
    renderItemList(filtered);
  });
});
