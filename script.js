/* ══════════════════════════════════════
   WELCOME SCREEN
══════════════════════════════════════ */
(function(){
  const overlay=document.getElementById('welcomeScreen');
  const tw=document.getElementById('welcomeTypewriter');
  if(!overlay||!tw)return;
  const url='kylejustinedimla.com';
  let i=0;
  const typeInterval=setInterval(()=>{
    if(i<=url.length){tw.textContent=url.slice(0,i)+'|';i++}
    else{clearInterval(typeInterval);tw.textContent=url}
  },200);
  setTimeout(()=>{
    overlay.classList.add('fade-out');
    setTimeout(()=>overlay.remove(),900);
  },3400);
})();

/* ══════════════════════════════════════
   FLOATING BLOBS — Scroll Parallax
══════════════════════════════════════ */
(function(){
  const blobs=[
    {el:document.getElementById('blob1'),ix:-4,iy:0},
    {el:document.getElementById('blob2'),ix:-4,iy:0},
    {el:document.getElementById('blob3'),ix:20,iy:-8},
    {el:document.getElementById('blob4'),ix:20,iy:-8}
  ];
  window.addEventListener('scroll',function(){
    const s=window.pageYOffset;
    blobs.forEach((b,idx)=>{
      if(!b.el)return;
      const xOff=Math.sin(s/100+idx*.5)*340;
      const yOff=Math.cos(s/100+idx*.5)*40;
      b.el.style.transform=`translate(${b.ix+xOff}px,${b.iy+yOff}px)`;
    });
  });
})();

/* ══════════════════════════════════════
   AOS — Scroll Animation System
══════════════════════════════════════ */
(function(){
  function initAOS(){
    const els=document.querySelectorAll('[data-aos]');
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const delay=parseInt(e.target.getAttribute('data-aos-delay')||'0',10);
          setTimeout(()=>e.target.classList.add('aos-animate'),delay);
        }
      });
    },{threshold:0.08});
    els.forEach(el=>{
      const dur=el.getAttribute('data-aos-duration');
      if(dur)el.style.transitionDuration=dur+'ms';
      obs.observe(el);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAOS);
  else initAOS();
})();

/* ══════════════════════════════════════
   TYPEWRITER — Hero Subtitle
══════════════════════════════════════ */
(function(){
  const el=document.getElementById('heroTypewriter');
  if(!el)return;
  const WORDS=['Software Engineer','IT Support Specialist','System Administrator'];
  const TYPE_SPEED=100,ERASE_SPEED=50,PAUSE=2000;
  let wi=0,ci=0,typing=true,text='';
  function tick(){
    if(typing){
      if(ci<WORDS[wi].length){text+=WORDS[wi][ci];ci++;el.textContent=text;setTimeout(tick,TYPE_SPEED)}
      else setTimeout(()=>{typing=false;tick()},PAUSE);
    }else{
      if(ci>0){text=text.slice(0,-1);ci--;el.textContent=text;setTimeout(tick,ERASE_SPEED)}
      else{wi=(wi+1)%WORDS.length;typing=true;tick()}
    }
  }
  tick();
})();

/* ══════════════════════════════════════
   NAVBAR — Scroll Effects
══════════════════════════════════════ */
(function(){
  const nav=document.getElementById('mainNav');
  const links=document.querySelectorAll('.nav-links a');
  const sections=document.querySelectorAll('section[id]');
  window.addEventListener('scroll',()=>{
    const st=window.scrollY;
    if(nav)nav.classList.toggle('scrolled',st>20);
    let cur='';
    sections.forEach(s=>{if(st>=s.offsetTop-300)cur=s.id});
    links.forEach(a=>{
      const h=a.getAttribute('href').replace('#','');
      a.classList.toggle('active',h===cur);
    });
  });
})();

/* ══════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════ */
(function(){
  const btn=document.getElementById('hamburgerBtn');
  const nav=document.getElementById('navLinks');
  if(!btn||!nav)return;
  btn.addEventListener('click',()=>{
    nav.classList.toggle('mobile-open');
    btn.classList.toggle('open');
    const icon=btn.querySelector('i');
    icon.className=nav.classList.contains('mobile-open')?'fas fa-times':'fas fa-bars';
    document.body.style.overflow=nav.classList.contains('mobile-open')?'hidden':'';
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('mobile-open');btn.classList.remove('open');
    btn.querySelector('i').className='fas fa-bars';
    document.body.style.overflow='';
  }));
})();

/* ══════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute('href'));
    if(t)window.scrollTo({top:t.offsetTop-80,behavior:'smooth'});
  });
});

/* ══════════════════════════════════════
   PORTFOLIO TABS
══════════════════════════════════════ */
function initTabs() {
  const btns = document.querySelectorAll('.tab-btn[data-tab]');
  const panels = document.querySelectorAll('.tab-panel');
  
  if (!btns.length || !panels.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      const target = document.getElementById('tab-' + tabId);
      
      if (!target) return;

      // Update buttons
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panels
      panels.forEach(p => p.classList.remove('active'));
      target.classList.add('active');

      // Trigger AOS animations for the new panel
      target.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.remove('aos-animate');
        setTimeout(() => el.classList.add('aos-animate'), 50);
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTabs);
} else {
  initTabs();
}

/* ══════════════════════════════════════
   SEE MORE / SEE LESS PROJECTS
══════════════════════════════════════ */
let showingAll=false;
function toggleProjects(){
  showingAll=!showingAll;
  const activeTabPanel = document.querySelector('.tab-panel.active');
  const extras=activeTabPanel ? activeTabPanel.querySelectorAll('.extra-project') : document.querySelectorAll('.extra-project');
  const btn=document.getElementById('seeMoreBtn');
  extras.forEach((card,i)=>{
    if(showingAll){
      card.style.display='';
      card.style.opacity='0';card.style.transform='translateY(20px)';
      setTimeout(()=>{card.style.transition='opacity .4s,transform .4s';card.style.opacity='1';card.style.transform='translateY(0)';
        card.querySelectorAll('[data-aos]').forEach(el=>el.classList.add('aos-animate'));
        card.classList.add('aos-animate');
      },i*80);
    }else{card.style.display='none'}
  });
  if(btn){
    btn.querySelector('span').textContent=showingAll?'See Less':'See More';
    btn.querySelector('i').style.transform=showingAll?'rotate(180deg)':'';
  }
}

/* ══════════════════════════════════════
   IMAGE LIGHTBOX
══════════════════════════════════════ */
const lbOverlay=document.getElementById('lightboxOverlay');
const lbImg=document.getElementById('lightboxImg');
const lbClose=document.getElementById('lightboxClose');
const lbPrev=document.getElementById('lightboxPrev');
const lbNext=document.getElementById('lightboxNext');
const lbCounter=document.getElementById('lightboxCounter');
const lbContent=document.querySelector('.lightbox-content');
let lbImages=[],lbIdx=0;

function openLightbox(card){
  const attr=card.getAttribute('data-images');
  if(!attr)return;
  lbImages=attr.split(',').map(s=>s.trim());
  lbIdx=0;
  
  lbOverlay.classList.add('active');
  document.body.style.overflow='hidden';
  
  lbContent.classList.remove('show');
  showLB(true);
}

function showLB(isInitial=false){
  if(!isInitial) {
    lbImg.classList.add('switching');
    setTimeout(() => {
      updateLBContent();
      lbImg.classList.remove('switching');
    }, 250);
  } else {
    updateLBContent();
    setTimeout(() => lbContent.classList.add('show'), 50);
  }
}

function updateLBContent(){
  lbImg.src=lbImages[lbIdx];
  lbCounter.textContent=(lbIdx+1)+' / '+lbImages.length;
  lbPrev.style.display=lbImages.length>1?'flex':'none';
  lbNext.style.display=lbImages.length>1?'flex':'none';
}

function closeLB(){
  lbContent.classList.remove('show');
  lbOverlay.classList.remove('active');
  setTimeout(()=>{document.body.style.overflow=''}, 400);
}

if(lbClose)lbClose.addEventListener('click',closeLB);
if(lbOverlay)lbOverlay.addEventListener('click',e=>{if(e.target===lbOverlay||e.target===lbContent)closeLB()});
if(lbPrev)lbPrev.addEventListener('click',e=>{e.stopPropagation();lbIdx=(lbIdx-1+lbImages.length)%lbImages.length;showLB()});
if(lbNext)lbNext.addEventListener('click',e=>{e.stopPropagation();lbIdx=(lbIdx+1)%lbImages.length;showLB()});
document.addEventListener('keydown',e=>{
  if(!lbOverlay||!lbOverlay.classList.contains('active'))return;
  if(e.key==='Escape')closeLB();
  if(e.key==='ArrowLeft'){lbIdx=(lbIdx-1+lbImages.length)%lbImages.length;showLB()}
  if(e.key==='ArrowRight'){lbIdx=(lbIdx+1)%lbImages.length;showLB()}
});

/* ══════════════════════════════════════
   CONTACT FORM (FormSubmit)
══════════════════════════════════════ */
(function(){
  const form=document.getElementById('contactForm');
  const btn=document.getElementById('submitBtn');
  const msg=document.getElementById('successMessage');
  if(!form)return;
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    btn.disabled=true;btn.querySelector('span').textContent='Sending...';
    const data={name:document.getElementById('name').value,email:document.getElementById('email').value,message:document.getElementById('message').value};
    try{
      const res=await fetch('https://formsubmit.co/ajax/dimlakylejustine@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)});
      if(res.ok){msg.style.display='block';form.reset();setTimeout(()=>msg.style.display='none',5000)}
    }catch(err){alert('Message sent! Thank you.');form.reset()}
    finally{btn.disabled=false;btn.querySelector('span').textContent='Send Message'}
  });
})();



/* ══════════════════════════════════════
   PROJECT DETAIL PANEL
══════════════════════════════════════ */
(function(){

  const PROJECTS = {
    /* ── SOFTWARE ── */
    'hris': {
      title: 'Integrated HRIS & Payroll System',
      category: 'Enterprise App',
      description: 'A full-stack Human Resource Information System with direct biometric hardware integration. Automatically calculates Days/Time-In/Out, processes Overtime, Undertime, Tax computations and employee Benefits to generate complete, audit-ready payslips. Built for Azzurro Hotel to replace manual HR workflows.',
      features: [
        'Biometric hardware integration with Hikvision terminals',
        'Automated payroll computation (OT, undertime, tax, benefits)',
        'Complete payslip generation with audit trail',
        'Multi-level HR portal with role-based access control',
        'Real-time attendance tracking and reporting',
        'SQL Server backend with optimized stored procedures'
      ],
      techs: ['C# / ASP.NET', 'SQL Server', 'JavaScript', 'HTML5', 'CSS3', 'Hikvision SDK'],
      liveDemo: null,
      github: null,
      image: 'Project images/HRIS/HRPORTAL.png'
    },
    'biometric': {
      title: 'Biometric SQL Integration & Live Monitor',
      category: 'Hardware Middleware',
      description: 'Middleware service connecting Hikvision biometric face terminals directly to a SQL Server database. Provides a real-time Time Card monitoring dashboard for HR personnel, eliminating manual punch-in records and synchronizing hardware attendance data seamlessly with enterprise systems.',
      features: [
        'Real-time data sync from Hikvision biometric terminals to SQL Server',
        'Live Time Card monitoring dashboard for HR',
        'Automatic hardware event capture and logging',
        'WebSocket-based live update engine',
        'Configurable shift and schedule rule engine',
        'Error handling and reconnect logic for 24/7 uptime'
      ],
      techs: ['C# / ASP.NET', 'SQL Server', 'WebSocket', 'Hikvision SDK', 'JavaScript'],
      liveDemo: null,
      github: null,
      image: 'Project images/Biometric SQL integration live monitor/home.png'
    },
    'inventory': {
      title: 'Multi-Department Inventory System',
      category: 'Web Application',
      description: 'A centralized inventory management platform deployed across all hotel departments. Tracks assets, consumables, and inter-department requisitions in one unified interface. Designed to eliminate inventory discrepancies and streamline procurement requests at Azzurro Hotel.',
      features: [
        'Centralized asset and consumable tracking across departments',
        'Inter-department requisition and transfer workflow',
        'Real-time stock level monitoring with low-stock alerts',
        'Audit log for all inventory movements',
        'Role-based access for department heads and admin',
        'Dashboard with inventory analytics and reports'
      ],
      techs: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap'],
      liveDemo: null,
      github: null,
      image: 'Project images/multi-department Inventory System/Home.png'
    },
    'mwos': {
      title: 'MWOS — Maintenance Work Order System',
      category: 'Workflow System',
      description: 'An end-to-end maintenance work order platform used as the official system for all hotel maintenance operations. Handles everything from ticket creation and assignment to expense tracking, with a multi-level approval workflow ensuring accountability at every step.',
      features: [
        'Full ticket lifecycle: creation → assignment → completion',
        'Multi-level approval workflow (technician, supervisor, admin)',
        'Expense and materials tracking per work order',
        'Priority-based queue management',
        'Real-time status updates and notifications',
        'Reporting dashboard for maintenance KPIs'
      ],
      techs: ['C# / ASP.NET', 'SQL Server', 'JavaScript', 'HTML5', 'CSS3'],
      liveDemo: null,
      github: null,
      image: 'Project images/MWOS/ticket.png'
    },
    'schedule': {
      title: 'Multi-Approval Schedule Plotter',
      category: 'Workflow Automation',
      description: 'A digital shift management tool that replaces manual scheduling spreadsheets. Department heads plot employee schedules which then route through a structured multi-level approval pipeline before being published. Ensures compliance and eliminates scheduling conflicts across all hotel departments.',
      features: [
        'Visual schedule plotter with drag-and-drop shift assignment',
        'Multi-level approval routing (dept head → HR → management)',
        'Conflict detection and schedule validation engine',
        'Auto-notification to approvers and employees',
        'Historical schedule archive and reporting',
        'Integration with HRIS for payroll reference'
      ],
      techs: ['C# / ASP.NET', 'SQL Server', 'JavaScript', 'HTML5', 'CSS3'],
      liveDemo: null,
      github: null,
      image: null
    },
    'purchasing': {
      title: 'Purchasing System',
      category: 'Optimization',
      description: 'A procurement management system with real-time inventory integration. Streamlines the purchasing process from purchase request to delivery confirmation, with SQL Server query optimization that improved system-wide performance by 60%. Handles vendor management, PO generation, and budget tracking.',
      features: [
        'End-to-end purchase request and PO management',
        'Real-time inventory level sync during procurement',
        'SQL Server query optimization — 60% performance improvement',
        'Vendor management and price comparison module',
        'Budget tracking and expenditure analytics',
        'Multi-approver sign-off workflow'
      ],
      techs: ['C# / ASP.NET', 'SQL Server', 'JavaScript', 'HTML5', 'CSS3'],
      liveDemo: null,
      github: null,
      image: null
    },
    'emeals': {
      title: 'Live Monitoring E-Meals System',
      category: 'Biometric IoT',
      description: 'A biometric meal tracking and monitoring system integrated with Hikvision Face Terminals. Tracks employee meal consumption in real time via WebSocket technology, providing HR and management with live visibility into cafeteria utilization and enforcing meal benefit policies automatically.',
      features: [
        'Real-time meal tracking via Hikvision Face Terminal',
        'WebSocket-powered live monitoring dashboard',
        'Automated meal benefit deduction per payroll period',
        'Per-employee meal consumption history and reports',
        'Alert system for unauthorized or exceeded meal claims',
        'Integration with HRIS payroll for deduction processing'
      ],
      techs: ['C# / ASP.NET', 'SQL Server', 'WebSocket', 'Hikvision SDK', 'JavaScript'],
      liveDemo: null,
      github: null,
      image: 'Project images/Emeals/Emeals.jpg'
    },
    'itms': {
      title: 'IT Management System (ITMS)',
      category: 'Management',
      description: 'A centralized IT asset management platform covering the full lifecycle of hardware and software assets. Includes maintenance scheduling, issue tracking, and resource allocation tools. Serves as the single source of truth for all IT assets across the hotel.',
      features: [
        'Complete IT asset register with lifecycle tracking',
        'Preventive maintenance scheduling and reminders',
        'Issue ticketing and resolution tracking',
        'Software license management and expiry alerts',
        'Resource allocation across departments',
        'Audit-ready reporting and asset history logs'
      ],
      techs: ['C# / ASP.NET', 'SQL Server', 'JavaScript', 'HTML5', 'CSS3'],
      liveDemo: null,
      github: null,
      image: null
    },
    'accountability': {
      title: 'Virtual Accountability System',
      category: 'Module',
      description: 'An accountability tracking module integrated within the ITMS. Manages equipment loans and asset accountability assignments, ensuring every piece of IT equipment is assigned to a responsible party with full digital chain-of-custody records.',
      features: [
        'Digital equipment loan and return management',
        'Signed accountability acknowledgment records',
        'Real-time tracking of loaned vs. available assets',
        'Automated reminders for overdue equipment returns',
        'Full chain-of-custody audit trail per asset',
        'Integration with ITMS asset registry'
      ],
      techs: ['C# / ASP.NET', 'SQL Server', 'JavaScript'],
      liveDemo: null,
      github: null,
      image: null
    },
    'verifile': {
      title: 'VeriFile — PDF Comparison Tool',
      category: 'Python Tool',
      description: 'A Python utility achieving 99.5% accuracy in change detection between PDF document versions. Built for quality assurance workflows where document integrity is critical. Highlights additions, deletions, and modifications between two PDF files and generates a detailed comparison report.',
      features: [
        '99.5% accuracy in multi-version PDF change detection',
        'Side-by-side visual diff highlighting added/removed content',
        'Detailed change report generation (HTML & PDF output)',
        'Batch processing support for multiple document pairs',
        'Text, image, and structural change detection',
        'QA workflow integration via CLI and config files'
      ],
      techs: ['Python', 'PyMuPDF', 'Difflib', 'ReportLab', 'CLI'],
      liveDemo: null,
      github: null,
      image: 'Project images/Verifile/Verifile.jpg'
    },
    'lagom': {
      title: 'Lagom Pool Villa — Management System',
      category: 'Property Management',
      description: 'A comprehensive room availability and cleanliness monitoring platform for Lagom Pool Villa. Integrates a real-time room status board, a guest ticketing system, and live chat support for staff — all in one dashboard. Automated notifications keep the team informed without manual follow-up.',
      features: [
        'Real-time room availability and cleanliness status board',
        'Guest issue ticketing system with priority routing',
        'Live staff chat support integrated into the platform',
        'Automated room notification emails and event logs',
        'Role-based access for president, managers, and staff',
        'Historical room status analytics and audit logs'
      ],
      techs: ['PHP', 'MySQL', 'WebSocket', 'JavaScript', 'HTML5', 'CSS3'],
      liveDemo: null,
      github: null,
      image: 'Project images/Lagom/president home.png'
    },
    'projectsummary': {
      title: 'Project Summary System',
      category: 'Reporting',
      description: 'A reporting platform that consolidates project data, milestones, and deliverables into a single, real-time dashboard. Gives management cross-department visibility into project status without requiring manual status updates from each team.',
      features: [
        'Centralized project data consolidation across departments',
        'Milestone and deliverable tracking with due-date alerts',
        'Real-time project status visibility for management',
        'Progress percentage tracking per project and department',
        'Export reports to PDF and Excel formats',
        'Timeline view with Gantt-style milestone visualization'
      ],
      techs: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Chart.js'],
      liveDemo: null,
      github: null,
      image: 'Project images/Project Summary/Project Summary.jpg'
    },
    'dailyreport': {
      title: 'Daily Report System',
      category: 'Productivity',
      description: 'An automated daily reporting application that streamlines documentation and activity tracking across hotel departments. Replaces manual paper-based reports with a digital workflow, ensuring consistent documentation and giving management instant access to daily operational summaries.',
      features: [
        'Structured daily activity logging per department',
        'Automated report generation and distribution',
        'Management dashboard with daily summary view',
        'Archive and search across historical daily reports',
        'Photo and attachment support for incident documentation',
        'Email notification to management on report submission'
      ],
      techs: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3'],
      liveDemo: null,
      github: null,
      image: 'Project images/Daily Report/Daily Report.png'
    },

    /* ── SYS ADMIN ── */
    'server-infra': {
      title: 'Server Infrastructure & TrueNAS',
      category: 'Infrastructure',
      description: 'Architected the entire hotel server infrastructure from scratch. Configured Domain Controllers, DNS, and Active Directory via Samba AD on Linux. Deployed TrueNAS Scale as the primary network-attached storage solution, providing centralized, reliable file services to all departments.',
      features: [
        'Built Domain Controller and Active Directory via Samba on Linux',
        'Configured DNS, DHCP, and Group Policies from scratch',
        'Deployed TrueNAS Scale with ZFS RAID for data integrity',
        'Network share provisioning per department with permissions',
        'Automated backup schedules for critical server data',
        'Monitoring and alerting for disk health and server uptime'
      ],
      techs: ['Linux', 'Samba AD', 'TrueNAS Scale', 'DNS', 'DHCP', 'ZFS', 'Active Directory'],
      liveDemo: null,
      github: null,
      image: null
    },
    'ms365': {
      title: 'Microsoft 365 Administration',
      category: 'Cloud Admin',
      description: 'Comprehensive Microsoft 365 tenant administration for the hotel organization. Handles end-user support, license allocation, security policy enforcement, and Exchange Admin operations. Manages the full MS365 ecosystem including Outlook, Teams, SharePoint, and OneDrive.',
      features: [
        'MS365 tenant setup and user lifecycle management',
        'Exchange Admin — mailbox provisioning, rules, backup',
        'Security policy configuration and MFA enforcement',
        'License allocation and subscription cost optimization',
        'SharePoint and OneDrive governance and permissions',
        'End-user helpdesk support for all MS365 applications'
      ],
      techs: ['Microsoft 365', 'Exchange Admin', 'Azure AD', 'SharePoint', 'OneDrive', 'Teams', 'PowerShell'],
      liveDemo: null,
      github: null,
      image: null
    },
    'migration': {
      title: 'Server Migration & Domain Integration',
      category: 'Windows Server',
      description: 'Led the full migration from legacy server infrastructure to a new domain environment using Windows Server and Active Directory. Migrated user accounts, shared drives, permissions, and policies with zero data loss and minimal downtime.',
      features: [
        'Full server-to-server migration with zero data loss',
        'Active Directory user and group migration',
        'Shared drive and permissions re-mapping',
        'Group Policy migration and validation',
        'DNS cutover and network reconfiguration',
        'Post-migration testing and rollback planning'
      ],
      techs: ['Windows Server', 'Active Directory', 'DNS', 'Group Policy', 'PowerShell', 'ADMT'],
      liveDemo: null,
      github: null,
      image: null
    },
    'vm': {
      title: 'Virtual Machine Management',
      category: 'Virtualization',
      description: 'Deployed and managed virtual machine infrastructure using VMware and Hyper-V. Created isolated VM environments for development, testing, and production workloads, enabling safe deployment pipelines and cost-efficient hardware utilization.',
      features: [
        'VM provisioning on VMware ESXi and Hyper-V',
        'Snapshot management for safe deployment rollbacks',
        'Resource allocation: CPU, RAM, storage per workload',
        'Network segmentation between dev, test, and production VMs',
        'Automated VM backup and recovery procedures',
        'Performance monitoring and right-sizing of VMs'
      ],
      techs: ['VMware', 'Hyper-V', 'Windows Server', 'Synology NAS', 'Virtualization'],
      liveDemo: null,
      github: null,
      image: 'Project images/Synology NAS/Synology.jpg'
    },
    'cabling': {
      title: 'Network Cabling & Restructuring',
      category: 'Physical Network',
      description: 'Complete network infrastructure overhaul for the hotel, including structured cabling installation, patch panel organization, and LAN optimization. Eliminated network bottlenecks and brought the physical layer up to enterprise standards.',
      features: [
        'Structured Cat6 cabling installation across all hotel floors',
        'Patch panel labeling and documentation',
        'Switch and router reconfiguration for optimized traffic flow',
        'VLAN segmentation for department isolation and security',
        'Cable testing and certification per TIA-568 standards',
        'Network diagram documentation for future maintenance'
      ],
      techs: ['Cat6 Cabling', 'Patch Panels', 'Managed Switches', 'VLANs', 'Network Tools'],
      liveDemo: null,
      github: null,
      image: 'Project images/Network Cabling and Restructuring/Network Cabling.jpg'
    },

    /* ── EDUCATION ── */
    'robot': {
      title: 'Line Following Robot',
      category: 'Robotics',
      description: 'An autonomous line following robot built from scratch using Arduino and IR sensors. Designed and assembled all hardware, calibrated sensor arrays, and developed the control algorithm in C++. Demonstrates core embedded systems and autonomous navigation principles.',
      features: [
        'Arduino-based embedded control system',
        'IR sensor array for path detection and calibration',
        'PID-like control algorithm for smooth line tracking',
        'Custom chassis design and hardware assembly',
        'Speed control via PWM motor driver',
        'Tested across multiple track configurations'
      ],
      techs: ['Arduino', 'C++', 'IR Sensors', 'PWM Motor Driver', 'Embedded Systems'],
      liveDemo: null,
      github: null,
      image: 'Project images/Line Following Robot/Line Following Robot.jpeg'
    },
    'mobilebot': {
      title: 'Mobile Controlled Robot',
      category: 'Robotics / IoT',
      description: 'A 4-wheel robot controlled via a custom Flutter mobile app communicating over Wi-Fi using an ESP8266 microcontroller. Built for remote navigation in hazardous or inaccessible areas, demonstrating IoT, embedded systems, and cross-platform mobile development skills.',
      features: [
        'ESP8266 Wi-Fi module for wireless robot control',
        'Custom Flutter app with real-time directional controls',
        'Bi-directional communication over WebSocket',
        '4-wheel drive with independent motor speed control',
        'Camera module integration for live video feed',
        'Range sensing for obstacle proximity alerts'
      ],
      techs: ['ESP8266', 'Flutter', 'WebSocket', 'IoT', 'C++', 'Dart'],
      liveDemo: null,
      github: null,
      image: 'Project images/Mobile Controlled Robot/Mobile Controlled Robot.jpeg'
    },
    'soap': {
      title: 'Solar-Powered Soap Dispenser',
      category: 'Electronics / IoT',
      description: 'An automatic soap dispenser powered entirely by solar energy, designed for public use in off-grid environments. Features a custom power distribution system and proximity sensor for touchless operation. Promotes public hygiene using renewable energy without grid dependency.',
      features: [
        'Solar panel with LiPo battery charge management',
        'Proximity sensor for contactless soap dispensing',
        'Custom power distribution and regulation circuit',
        'Weatherproof enclosure for outdoor use',
        'Low-battery indicator and auto power-saving mode',
        'Modular design for easy refill and maintenance'
      ],
      techs: ['Solar Electronics', 'Proximity Sensors', 'Power Distribution', 'LiPo Battery', 'PCB Design'],
      liveDemo: null,
      github: null,
      image: 'Project images/Solar Powered Soap Dispenser/Soap dispenser.jpeg'
    },
    'photobooth': {
      title: '360 Photobooth with Coinslot',
      category: 'Commercial IoT',
      description: 'An interactive 360° photobooth with full hardware integration. Custom Flutter UI controls the motor rotation for 360° shots, while Arduino handles coinslot logic and payment validation. Designed as a commercial product — fully automated and self-operating after payment.',
      features: [
        'Coin slot integration with payment validation logic',
        'Arduino motor controller for 360° platform rotation',
        'Flutter app with custom countdown and capture UI',
        'Automated photo processing and printing trigger',
        'Session management — resets after each use',
        'Commercial enclosure design with operator controls'
      ],
      techs: ['Flutter', 'Arduino', 'Motor Control', 'Coinslot Integration', 'IoT', 'Dart'],
      liveDemo: null,
      github: null,
      image: null
    },
    'skyharvest': {
      title: 'Skyharvest: AI-Driven Aeroponics Vertical Farming',
      category: 'Thesis · IoT · AI/ML',
      description: 'Best in Thesis award-winning capstone project. An intelligent vertical farming system combining IoT sensors, Machine Learning, and a Flutter mobile app to automate precision agriculture. The system monitors environmental parameters, predicts optimal conditions, and controls actuators automatically to maximize crop yield with minimal human intervention.',
      features: [
        'ML model for crop condition prediction and optimization',
        'IoT sensor array: humidity, temperature, pH, nutrient levels',
        'Automated actuator control (misting, lighting, nutrient dosing)',
        'Flutter mobile app for real-time monitoring and manual override',
        'Data logging and agricultural analytics dashboard',
        'Aeroponics system design for water-efficient vertical farming'
      ],
      techs: ['IoT', 'Machine Learning', 'Flutter', 'Arduino', 'Python', 'Sensors', 'Dart', 'Aeroponics'],
      liveDemo: null,
      github: null,
      image: 'Project images/Sky Harvest/Sky Harvest.jpeg'
    },
    'skill-sysadmin': {
      title: 'System Administration',
      category: 'Core Skill',
      description: 'Expertise in designing, deploying, and maintaining enterprise-grade IT infrastructure. Proficient in Windows Server environments, Active Directory management, and specialized storage solutions.',
      features: [
        'Active Directory, DNS, and DHCP configuration',
        'Group Policy Object (GPO) implementation',
        'TrueNAS Scale & ZFS storage management',
        'Samba AD integration on Linux',
        'Server health monitoring and documentation',
        'Disaster recovery and backup planning'
      ],
      techs: ['Windows Server', 'Linux', 'Samba', 'TrueNAS', 'Active Directory'],
      image: null
    },
    'skill-ms365': {
      title: 'MS365 Administration',
      category: 'Core Skill',
      description: 'Comprehensive management of Microsoft 365 cloud environments, ensuring secure and efficient collaboration for organizational users.',
      features: [
        'Exchange Online and Mailbox management',
        'SharePoint and OneDrive governance',
        'Azure AD / Microsoft Entra ID management',
        'MFA and Security policy enforcement',
        'Teams administration and user support',
        'License and subscription optimization'
      ],
      techs: ['Microsoft 365', 'Exchange Admin', 'Azure AD', 'Teams'],
      image: null
    },
    'skill-csharp': {
      title: 'C# / ASP.NET Development',
      category: 'Core Skill',
      description: 'Full-stack development of enterprise web applications using the .NET ecosystem, focusing on robust architecture and scalable backends.',
      features: [
        'ASP.NET Core / MVC web applications',
        'RESTful API design and implementation',
        'Entity Framework Core integration',
        'Windows Service and middleware development',
        'SignalR for real-time communication',
        'Identity and security implementation'
      ],
      techs: ['C#', 'ASP.NET', '.NET Core', 'SQL Server'],
      image: null
    },
    'skill-phpnode': {
      title: 'PHP & Node.js',
      category: 'Core Skill',
      description: 'Versatile backend development skills using both synchronous (PHP) and asynchronous (Node.js) paradigms to build efficient web services.',
      features: [
        'Custom PHP application development',
        'Node.js runtime and NPM ecosystem',
        'Express.js API development',
        'WebSocket (Socket.io) integration',
        'Server-side rendering and templating',
        'API middleware and integration'
      ],
      techs: ['PHP', 'Node.js', 'Express', 'Laravel'],
      image: null
    },
    'skill-sql': {
      title: 'SQL Server & MySQL',
      category: 'Core Skill',
      description: 'Strong foundation in relational database management, from schema design to complex query optimization and performance tuning.',
      features: [
        'Relational database schema design',
        'Stored procedures and trigger development',
        'Complex SQL query optimization',
        'Data migration and ETL processes',
        'Backup, recovery, and maintenance plans',
        'Database security and user permissions'
      ],
      techs: ['SQL Server', 'MySQL', 'T-SQL', 'Relational Design'],
      image: null
    },
    'skill-js': {
      title: 'JavaScript Development',
      category: 'Core Skill',
      description: 'Advanced frontend and backend logic using JavaScript, creating interactive user experiences and efficient server-side scripts.',
      features: [
        'Modern ES6+ syntax and best practices',
        'DOM manipulation and Event handling',
        'Asynchronous programming (Promises/Async-Await)',
        'JSON and REST API consumption',
        'Frontend performance optimization',
        'Client-side state management'
      ],
      techs: ['JavaScript', 'ES6', 'DOM API', 'Fetch API'],
      image: null
    },
    'skill-python': {
      title: 'Python Scripting',
      category: 'Core Skill',
      description: 'Automation and data processing using Python, specializing in utility scripts and complex document comparison tools.',
      features: [
        'Automated task and workflow scripting',
        'Data extraction and processing (PDF/Excel)',
        'Machine Learning model implementation',
        'File system and OS-level automation',
        'Utility tool development (CLI)',
        'Library integration (Pandas, PyMuPDF)'
      ],
      techs: ['Python', 'PyMuPDF', 'Pandas', 'Automation'],
      image: null
    },
    'skill-flutter': {
      title: 'Flutter Mobile Development',
      category: 'Core Skill',
      description: 'Cross-platform mobile application development using Flutter and Dart, with a focus on IoT control and real-time interfaces.',
      features: [
        'Cross-platform iOS and Android apps',
        'Reactive UI design and implementation',
        'State management (Provider/Bloc)',
        'Hardware/IoT device integration',
        'Custom animations and styling',
        'Firebase and API integration'
      ],
      techs: ['Flutter', 'Dart', 'IoT', 'Mobile Dev'],
      image: null
    },
    'skill-networking': {
      title: 'Networking & Infrastructure',
      category: 'Core Skill',
      description: 'Design and maintenance of reliable network infrastructures, including physical cabling and logical segmentation.',
      features: [
        'Structured cabling and LAN design',
        'Managed switch and router configuration',
        'VLAN segmentation and security',
        'VPN and remote access setup',
        'Network troubleshooting and optimization',
        'Firewall and gateway management'
      ],
      techs: ['TCP/IP', 'VLAN', 'Cat6', 'Routing'],
      image: null
    },
    'skill-biometrics': {
      title: 'Biometric Integration',
      category: 'Core Skill',
      description: 'Specialized expertise in bridging hardware and software through the integration of biometric attendance systems.',
      features: [
        'Hikvision SDK/ISAPI integration',
        'Face terminal hardware configuration',
        'Real-time attendance event capture',
        'Hardware-to-Database middleware dev',
        'Time & Attendance logic implementation',
        'Biometric data security compliance'
      ],
      techs: ['Biometrics', 'Hikvision', 'Hardware Integration'],
      image: null
    }
  };

  const overlay = document.getElementById('pdpOverlay');
  const panel   = document.getElementById('pdpPanel');
  const closeBtn = document.getElementById('pdpClose');

  function openPanel(key) {
    const p = PROJECTS[key];
    if (!p) return;

    // Populate
    document.getElementById('pdpTitle').textContent = p.title;
    document.getElementById('pdpBreadcrumbTitle').textContent = p.title;
    document.getElementById('pdpDesc').textContent = p.description;
    document.getElementById('pdpTechCount').textContent = p.techs.length + ' Technologies';
    document.getElementById('pdpFeatureCount').textContent = p.features.length + ' Features';

    // Features
    const featuresList = document.getElementById('pdpFeatures');
    featuresList.innerHTML = p.features.map(f => `<li><i class="fas fa-circle-dot"></i>${f}</li>`).join('');

    // Tech tags
    const techContainer = document.getElementById('pdpTechTags');
    techContainer.innerHTML = p.techs.map(t => `<span class="pdp-tech-tag">${t}</span>`).join('');

    // Links
    const linksEl = document.getElementById('pdpLinks');
    let linksHTML = '';
    if (p.liveDemo) linksHTML += `<a href="${p.liveDemo}" target="_blank" class="pdp-link-btn primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
    if (p.github)   linksHTML += `<a href="${p.github}"   target="_blank" class="pdp-link-btn ghost"><i class="fab fa-github"></i> GitHub</a>`;
    linksEl.innerHTML = linksHTML;

    // Preview image
    const img = document.getElementById('pdpPreviewImg');
    const placeholder = document.getElementById('pdpPreviewPlaceholder');
    if (p.image) {
      img.src = p.image;
      img.style.display = 'block';
      placeholder.style.display = 'none';
    } else {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
    }

    // Show overlay
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => panel.classList.add('slide-in'));
  }

  function closePanel() {
    panel.classList.remove('slide-in');
    overlay.classList.remove('active');
    setTimeout(() => { document.body.style.overflow = ''; }, 400);
  }

  // Bind cards
  function bindCards() {
    document.querySelectorAll('.project-card[data-pdp-key]').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(e) {
        // Don't intercept gallery / image clicks
        if (e.target.closest('.project-card-img') || e.target.closest('.link-details')) return;
        openPanel(this.getAttribute('data-pdp-key'));
      });
    });
  }

  closeBtn?.addEventListener('click', closePanel);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closePanel(); });
  document.addEventListener('keydown', e => {
    if (overlay?.classList.contains('active') && e.key === 'Escape') closePanel();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindCards);
  else bindCards();

})();

(function(){
  const container=document.getElementById('chatContainer');
  const toggle=document.getElementById('chatToggleBtn');
  const close=document.getElementById('closeChatBtn');
  const input=document.getElementById('chatInput');
  const send=document.getElementById('chatSendBtn');
  const messages=document.getElementById('chatMessages');

  toggle?.addEventListener('click',()=>{container.classList.toggle('active');if(container.classList.contains('active'))input.focus()});
  close?.addEventListener('click',()=>container.classList.remove('active'));

  function getCtx(){
    let c='You are the AI representative for Kyle Justine C. Dimla.\nINSTRUCTIONS:\n1. Answer based on the resume below.\n2. Use bullet points for lists and bold for key skills.\n3. Be professional and concise.\n--- RESUME ---\n';
    ['About','Portfolio','Contact'].forEach(id=>{const el=document.getElementById(id);if(el)c+='['+id.toUpperCase()+']\n'+el.innerText.replace(/\s+/g,' ').trim()+'\n\n'});
    return c;
  }
  function fmt(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<strong>$1</strong>').replace(/^\s*[-*]\s+(.*)$/gm,'• $1')}
  function addMsg(t,isUser,type){const d=document.createElement('div');d.className='message '+(isUser?'user':'bot '+(type||''));if(isUser||type==='loading')d.textContent=t;else d.innerHTML=fmt(t);messages.appendChild(d);messages.scrollTop=messages.scrollHeight;return d}

  async function sendMsg(){
    const t=input.value.trim();if(!t)return;
    addMsg(t,true);input.value='';
    const ld=addMsg('Thinking...',false,'loading');
    try{
      const r=await fetch('/.netlify/functions/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:t,context:getCtx()})});
      const d=await r.json();messages.removeChild(ld);
      if(d.error)addMsg('Error: '+d.error,false);
      else addMsg(d.candidates?.[0]?.content?.parts?.[0]?.text||'No response.',false);
    }catch(err){messages.removeChild(ld);addMsg('System Error: Unable to reach AI server.',false)}
  }
  send?.addEventListener('click',sendMsg);
  input?.addEventListener('keypress',e=>{if(e.key==='Enter')sendMsg()});
})();