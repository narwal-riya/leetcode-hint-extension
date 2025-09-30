(function initExtension() {
  // create elements
  const hintBtn = document.createElement('button');
  const hintContainer = document.createElement('div');
  
  // Set element properties
  hintBtn.innerHTML = '💡 Get Hint!';
  hintBtn.id = 'leet-hint-btn';
  hintContainer.id = 'leet-hint-container';
  hintContainer.style.display = 'none';

  //Adding styles
  hintBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    padding: 10px 15px;
    background: #ffa116;
    color: black;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;

  hintContainer.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 300px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 9998;
    padding: 15px;
    font-family: Arial, sans-serif;
    display: none;
  `;

  // linking and loading CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('style.css');
  document.head.appendChild(link);

  // Our Hint database
  const hints = {
    general: [
      "Have you considered the edge cases?",
      "Try explaining the problem aloud first!",
      "Try the brute-force solution.",
      "Keep time and space complexity in mind!",
      "Try using hash maps to optimize?",
      "Will sorting help?"
    ],
    arrays: [
      "💡 Two-pointer technique often works.",
      "💡 Consider prefix sums.",
      "💡 Sliding window approach?"
    ],
    binary_search: [
      "💡 Think about the search space.",
      "💡 Always check mid and move left/right.",
      "💡 Watch out for infinite loops!"
    ],
    strings: [
      "💡 Try using a hash map for character counts.",
      "💡 Two-pointer substring tricks may help.",
      "💡 Sliding window is powerful for string problems."
    ],
    linked_list: [
      "💡 For finding mid use slow & fast pointers.",
      "💡 Watch for null pointers carefully.",
      "💡 Reversing the list might simplify things."
    ],
    recursion: [
      "💡 Define base and recursive cases clearly.",
      "💡 Try drawing a recursion tree.",
      "💡 Memoization may avoid repeated work."
    ],
    stack_queue: [
      "💡 Stacks are great for parentheses and monotonic problems.",
      "💡 Queues often help with BFS.",
      "💡 Deque = sliding window optimization."
    ],
    sliding_window: [
      "💡 Expand and shrink the window smartly.",
      "💡 Keep track of counts or sums.",
      "💡 Often O(n) solution possible."
    ],
    two_pointer: [
      "💡 Start from both ends.",
      "💡 One pointer moves faster than the other.",
      "💡 Great for sorted arrays."
    ],
    heaps: [
      "💡 PriorityQueue helps for top-K problems.",
      "💡 Min-heap vs Max-heap matters.",
      "💡 Consider heapify for efficiency."
    ],
    greedy: [
      "💡 Try sorting and picking step by step.",
      "💡 Exchange arguments can prove correctness.",
      "💡 Watch out for local vs global optimal choice."
    ],
    "Binary Tree": [
      "💡 DFS (pre/in/post order) is often useful.",
      "💡 BFS = level order traversal.",
      "💡 Recursion simplifies tree problems."
    ],
    bst: [
      "💡 Inorder traversal gives sorted order.",
      "💡 Exploit BST property: left < root < right.",
      "💡 Think about recursive definitions."
    ],
    graphs: [
      "💡 BFS for shortest path (unweighted).",
      "💡 DFS for connectivity.",
      "💡 Dijkstra / Bellman-Ford for weighted paths."
    ]
  };

  // Detect topic from LeetCode problem metadata
function detectProblemTopic() {
  try {
    const metaScript = document.querySelector('script#__NEXT_DATA__');
    if (metaScript) {
      const meta = JSON.parse(metaScript.textContent);
      const tags = meta?.props?.pageProps?.dehydratedState?.queries?.[0]?.state?.data?.question?.topicTags || [];
      const tagNames = tags.map(tag => tag.name.toLowerCase());

      for (const topic of Object.keys(hints)) {
        if (tagNames.some(tag => tag.includes(topic))) {
          return topic;
        }
      }
    }
  } catch (err) {
    console.error("Error detecting problem topic:", err);
  }
  return "general";
}


  // Button click handler
  hintBtn.addEventListener('click', () => {
    const isVisible = hintContainer.style.display === 'block';
    hintContainer.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
      const topic = detectProblemTopic();
      const topicHints = hints[topic] || hints.general;
      const randomHint = topicHints[Math.floor(Math.random() * topicHints.length)];
      
      hintContainer.innerHTML = `
        <div style="color: #333; line-height: 1.5;">
          <h3 style="color: #ffa116; margin-top: 0; font-size: 18px;">
            LeetCode Hint (${topic})
          </h3>
          <p>${randomHint}</p>
          <button id="close-hint" 
            style="background: #f0f0f0; border: none; padding: 8px 15px; 
                   margin-top: 10px; cursor: pointer; border-radius: 4px;">
            Got it!
          </button>
        </div>
      `;
    
      document.getElementById('close-hint').addEventListener('click', () => {
        hintContainer.style.display = 'none';
      });
    }
  });

  // Add elements to page with safety check
  function addElements() {
  try {
    // Only run on problem pages
    if (window.location.href.includes("/problems/") && !document.getElementById('leet-hint-btn')) {
      document.body.appendChild(hintContainer);
      document.body.appendChild(hintBtn);
    }
  } catch (error) {
    console.error('Error adding elements:', error);
  }
}

  // Wait for LeetCode to load
  if (document.body) {
    addElements();
  } else {
    document.addEventListener('DOMContentLoaded', addElements);
    setTimeout(addElements, 3000);
  }
})(); 