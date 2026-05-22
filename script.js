// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Navigation active state and sticky header
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const menuToggle = document.getElementById('menuToggle');
  const navLinksContainer = document.getElementById('navLinks');
  
  window.addEventListener('scroll', () => {
    // Header background change
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navLinksContainer.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        menuToggle.querySelector('i').setAttribute('data-lucide', 'menu');
        lucide.createIcons();
      });
    });
  }

  // Project Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      formStatus.className = 'form-status';
      formStatus.style.display = 'block';
      formStatus.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Transmission initiated...';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        formStatus.className = 'form-status success';
        formStatus.innerHTML = '<i data-lucide="check-circle"></i> Message received. Alex Rivera will connect with you within 24 operational hours.';
        contactForm.reset();
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1500);
    });
  }

  // --- HTML5 CANVAS PIPELINE VISUALIZER ---
  initPipelineVisualizer();

  // --- SUPPLY CHAIN KPI SIMULATOR ---
  initKpiSimulator();
});

// Canvas Visualizer Logic
function initPipelineVisualizer() {
  const canvas = document.getElementById('flowCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    setupNodes();
  });

  // Node Configuration
  let nodes = [];
  function setupNodes() {
    nodes = [
      { id: 'supplier', label: 'Supplier Hub', x: width * 0.12, y: height * 0.5, color: '#818cf8', subtext: 'Inbound Flow', pulseRadius: 0 },
      { id: 'factory', label: 'Manufacturing', x: width * 0.38, y: height * 0.5, color: '#f43f5e', subtext: 'Processing', pulseRadius: 0 },
      { id: 'warehouse', label: 'Distribution Center', x: width * 0.64, y: height * 0.5, color: '#fb923c', subtext: 'Cross-Docking', pulseRadius: 0 },
      { id: 'retailer', label: 'Client Markets', x: width * 0.88, y: height * 0.5, color: '#00fe9c', subtext: '98% Service', pulseRadius: 0 }
    ];
  }
  setupNodes();

  // Active Flow Particles
  let particles = [];
  const maxParticles = 12;

  function spawnParticle(sourceIndex) {
    if (sourceIndex >= nodes.length - 1) return;
    const startNode = nodes[sourceIndex];
    const endNode = nodes[sourceIndex + 1];
    
    particles.push({
      startIdx: sourceIndex,
      x: startNode.x,
      y: startNode.y,
      progress: 0,
      speed: 0.006 + Math.random() * 0.008,
      size: 4 + Math.random() * 4,
      color: startNode.color
    });
  }

  // Seed initial particles
  for (let i = 0; i < 3; i++) {
    spawnParticle(0);
    spawnParticle(1);
    spawnParticle(2);
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw grid background lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw flow connection paths
    ctx.lineWidth = 3;
    for (let i = 0; i < nodes.length - 1; i++) {
      const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[i+1].x, nodes[i+1].y);
      grad.addColorStop(0, nodes[i].color);
      grad.addColorStop(1, nodes[i+1].color);
      
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      
      // Draw smooth sine-wave-like curve for aesthetic logistics lanes
      const midX = (nodes[i].x + nodes[i+1].x) / 2;
      ctx.bezierCurveTo(midX, nodes[i].y - 30, midX, nodes[i+1].y + 30, nodes[i+1].x, nodes[i+1].y);
      ctx.stroke();
    }

    // Update & Draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.progress += p.speed;

      if (p.progress >= 1) {
        // Trigger pulse on the receiving node
        const endNode = nodes[p.startIdx + 1];
        endNode.pulseRadius = 25;
        
        // Spawn next leg or reset
        if (p.startIdx < nodes.length - 2) {
          spawnParticle(p.startIdx + 1);
        } else {
          // Loop back from supplier
          spawnParticle(0);
        }
        particles.splice(i, 1);
        continue;
      }

      // Compute particle coordinates along bezier curve
      const start = nodes[p.startIdx];
      const end = nodes[p.startIdx + 1];
      const midX = (start.x + end.x) / 2;
      
      const t = p.progress;
      const mt = 1 - t;
      
      // Bezier formula: P = (1-t)^3*P0 + 3*t*(1-t)^2*P1 + 3*t^2*(1-t)*P2 + t^3*P3
      const cp1x = midX;
      const cp1y = start.y - 30;
      const cp2x = midX;
      const cp2y = end.y + 30;
      
      p.x = mt*mt*mt*start.x + 3*t*mt*mt*cp1x + 3*t*t*mt*cp2x + t*t*t*end.x;
      p.y = mt*mt*mt*start.y + 3*t*mt*mt*cp1y + 3*t*t*mt*cp2y + t*t*t*end.y;

      // Draw particle glowing core
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow
    }

    // Draw Nodes
    nodes.forEach(node => {
      // Pulse effect on receipt
      if (node.pulseRadius > 0) {
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
        node.pulseRadius -= 0.8;
      }

      // Outer glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = node.color;
      ctx.fillStyle = '#080c16';
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset

      // Center dot
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
      ctx.fill();

      // Node Text Info
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y - 28);

      ctx.font = '500 10px "Inter", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(node.subtext, node.x, node.y + 32);
    });

    // Auto-replenish supplier particles if density drops
    if (particles.filter(p => p.startIdx === 0).length < 2 && Math.random() < 0.02) {
      spawnParticle(0);
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// KPI Dashboard Simulator Logic
function initKpiSimulator() {
  const inputLeadTime = document.getElementById('input-leadTime');
  const inputVolatility = document.getElementById('input-volatility');
  const inputSafetyStock = document.getElementById('input-safetyStock');

  const valLeadTime = document.getElementById('val-leadTime');
  const valVolatility = document.getElementById('val-volatility');
  const valSafetyStock = document.getElementById('val-safetyStock');

  const kpiOtif = document.getElementById('kpi-val-otif');
  const kpiCost = document.getElementById('kpi-val-cost');
  const kpiRisk = document.getElementById('kpi-val-risk');

  const trendOtif = document.getElementById('kpi-trend-otif');
  const trendCost = document.getElementById('kpi-trend-cost');
  const trendRisk = document.getElementById('kpi-trend-risk');

  // Presets
  const presetStable = document.getElementById('preset-stable');
  const presetDisruption = document.getElementById('preset-disruption');
  const presetLean = document.getElementById('preset-lean');

  if (!inputLeadTime || !kpiChartCanvas()) return;

  // Initialize Chart.js
  let chart;
  const ctx = document.getElementById('kpiChart').getContext('2d');

  function kpiChartCanvas() {
    return document.getElementById('kpiChart');
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Base demand seasonal curve (average demand ~1000 units/mo)
  const baseDemand = [950, 820, 880, 1050, 1200, 1380, 1290, 1100, 980, 1020, 1150, 1300];

  function getSimulationData(leadTime, volatility, safetyStock) {
    const data = {
      demand: [],
      inventory: [],
      safetyStockLine: [],
      stockouts: []
    };

    let currentInventory = 1500; // Starting inventory

    for (let i = 0; i < 12; i++) {
      // Stochastic demand based on seasonal base + volatility factor
      const seed = Math.sin(i * 1.5) * 50; // semi-predictable noise
      const volatilityModifier = (volatility / 100) * (Math.sin(i * 2) > 0 ? 1 : -1) * (80 + seed);
      const demandVal = Math.round(baseDemand[i] + volatilityModifier);
      data.demand.push(demandVal);

      // Target Safety Stock quantity (Weeks of safety stock * average weekly demand)
      const avgWeeklyDemand = baseDemand[i] / 4.33;
      const safetyStockQty = Math.round(safetyStock * avgWeeklyDemand);
      data.safetyStockLine.push(safetyStockQty);

      // Inventory calculation
      // Lead time delays incoming order shipment matching demand.
      // If lead time is higher, orders placed last month arrive later, causing a dip.
      const leadTimeImpactFactor = (leadTime - 10) * 8;
      const supplyArrival = Math.round(baseDemand[i] - leadTimeImpactFactor + (safetyStockQty * 0.2));
      
      currentInventory = Math.round(currentInventory + supplyArrival - demandVal);
      
      // Clamping inventory at 0 (representing a stockout)
      let stockoutOccurred = false;
      if (currentInventory <= 0) {
        currentInventory = 0;
        stockoutOccurred = true;
      }
      
      data.inventory.push(currentInventory);
      data.stockouts.push(stockoutOccurred ? currentInventory : null);

      // Prepare inventory buffer to pass to next month
      if (currentInventory === 0) {
        currentInventory = Math.round(safetyStockQty * 0.8 + 200); // replenishment cycle
      }
    }

    return data;
  }

  function updateDashboard() {
    const leadTime = parseInt(inputLeadTime.value);
    const volatility = parseInt(inputVolatility.value);
    const safetyStock = parseFloat(inputSafetyStock.value);

    // Update Slider text
    valLeadTime.textContent = `${leadTime} Days`;
    valVolatility.textContent = `${volatility}%`;
    valSafetyStock.textContent = `${safetyStock.toFixed(1)} Wks`;

    // Calculate metrics
    // 1. OTIF (On-time in-full): drops with high lead times & high volatility, rises with safety stock buffer
    const otifBase = 99.8;
    const safetyBufferFactor = Math.min(2.5, safetyStock) * 3.5;
    const volatilityPenalty = (volatility / 100) * 16;
    const leadTimePenalty = (leadTime / 30) * 12;
    
    // OTIF calculation
    let otifVal = otifBase - (volatilityPenalty + leadTimePenalty) + safetyBufferFactor;
    otifVal = Math.min(100, Math.max(65, otifVal));
    
    // 2. Holding cost: increases directly with safety stock buffer and lead time (requires bulk storage)
    const baseHoldingCost = 45000;
    const safetyStockCost = safetyStock * 48000;
    const pipelineCost = leadTime * 2200;
    const totalHoldingCost = baseHoldingCost + safetyStockCost + pipelineCost;

    // 3. Stockout Risk: inversely proportional to safety stock relative to demand fluctuation
    const zScore = safetyStock * 0.8; // Z-score approximation
    let stockoutProb = (volatility / 2.5) / (zScore + 0.5);
    stockoutProb = Math.min(95, Math.max(0.5, stockoutProb + (leadTime * 0.2)));

    // Render numbers
    kpiOtif.textContent = `${otifVal.toFixed(1)}%`;
    kpiCost.textContent = `$${Math.round(totalHoldingCost).toLocaleString()}`;
    kpiRisk.textContent = `${stockoutProb.toFixed(1)}%`;

    // Dynamic trends formatting
    if (otifVal >= 95) {
      trendOtif.className = 'kpi-trend positive';
      trendOtif.innerHTML = '<i data-lucide="check-circle-2"></i> Target Met (&gt;95%)';
    } else if (otifVal >= 88) {
      trendOtif.className = 'kpi-trend neutral';
      trendOtif.innerHTML = '<i data-lucide="minus"></i> Borderline Performance';
    } else {
      trendOtif.className = 'kpi-trend negative';
      trendOtif.innerHTML = '<i data-lucide="alert-triangle"></i> Action Required';
    }

    if (totalHoldingCost < 120000) {
      trendCost.className = 'kpi-trend positive';
      trendCost.innerHTML = '<i data-lucide="trending-down"></i> High Capital Efficiency';
    } else if (totalHoldingCost < 200000) {
      trendCost.className = 'kpi-trend neutral';
      trendCost.innerHTML = '<i data-lucide="minus"></i> Balanced Capital';
    } else {
      trendCost.className = 'kpi-trend negative';
      trendCost.innerHTML = '<i data-lucide="trending-up"></i> High Working Capital';
    }

    if (stockoutProb < 5) {
      trendRisk.className = 'kpi-trend positive';
      trendRisk.innerHTML = '<i data-lucide="shield"></i> Safe Operations';
    } else if (stockoutProb < 15) {
      trendRisk.className = 'kpi-trend neutral';
      trendRisk.innerHTML = '<i data-lucide="alert-circle"></i> Moderate Risk';
    } else {
      trendRisk.className = 'kpi-trend negative';
      trendRisk.innerHTML = '<i data-lucide="zap"></i> Critical Stockout Risk';
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Get simulation datasets for graph
    const simData = getSimulationData(leadTime, volatility, safetyStock);

    // Update Chart
    if (chart) {
      chart.data.datasets[0].data = simData.demand;
      chart.data.datasets[1].data = simData.inventory;
      chart.data.datasets[2].data = simData.safetyStockLine;
      chart.data.datasets[3].data = simData.stockouts;
      chart.update('none'); // Update without animation for slider responsiveness
    } else {
      createChart(simData);
    }
  }

  function createChart(simData) {
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Monthly Demand',
            data: simData.demand,
            borderColor: 'rgba(148, 163, 184, 0.5)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.3,
            pointRadius: 0
          },
          {
            label: 'Inventory Level',
            data: simData.inventory,
            borderColor: '#00f2fe',
            borderWidth: 3,
            backgroundColor: 'rgba(0, 242, 254, 0.05)',
            fill: true,
            tension: 0.3,
            pointRadius: 2,
            pointHoverRadius: 5
          },
          {
            label: 'Safety Stock Limit',
            data: simData.safetyStockLine,
            borderColor: '#00fe9c',
            borderWidth: 2,
            borderDash: [3, 3],
            fill: false,
            tension: 0.1,
            pointRadius: 0
          },
          {
            label: 'Stockouts',
            data: simData.stockouts,
            borderColor: '#ff4d6d',
            backgroundColor: '#ff4d6d',
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#94a3b8',
              font: {
                family: "'Inter', sans-serif",
                size: 11
              },
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            titleFont: { family: "'Plus Jakarta Sans', sans-serif", weight: 'bold' },
            bodyFont: { family: "'Inter', sans-serif" },
            padding: 10
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.03)'
            },
            ticks: {
              color: '#64748b',
              font: { family: "'Inter', sans-serif" }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.03)'
            },
            ticks: {
              color: '#64748b',
              font: { family: "'Inter', sans-serif" }
            },
            title: {
              display: true,
              text: 'Units in Stock / Demand',
              color: '#64748b',
              font: { family: "'Inter', sans-serif", size: 10 }
            }
          }
        }
      }
    });
  }

  // Add event listeners to sliders
  [inputLeadTime, inputVolatility, inputSafetyStock].forEach(input => {
    input.addEventListener('input', updateDashboard);
  });

  // Scenario Presets Listeners
  if (presetStable) {
    presetStable.addEventListener('click', () => {
      inputLeadTime.value = 7;
      inputVolatility.value = 10;
      inputSafetyStock.value = 1.5;
      updateDashboard();
    });
  }

  if (presetDisruption) {
    presetDisruption.addEventListener('click', () => {
      inputLeadTime.value = 26;
      inputVolatility.value = 45;
      inputSafetyStock.value = 4.0;
      updateDashboard();
    });
  }

  if (presetLean) {
    presetLean.addEventListener('click', () => {
      inputLeadTime.value = 4;
      inputVolatility.value = 12;
      inputSafetyStock.value = 0.5;
      updateDashboard();
    });
  }

  // Initial Calculation Run
  updateDashboard();
}
