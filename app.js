// Initialize Lucide Icons
lucide.createIcons();

// ==========================================
// 1. 4D GEOMETRY GENERATORS (Math Core)
// ==========================================

class Geometry4D {
  // 1. Tesseract (8-Cell / Hypercube)
  static createTesseract() {
    const vertices = [];
    for (let i = 0; i < 16; i++) {
      vertices.push([
        (i & 1) ? 1 : -1,
        (i & 2) ? 1 : -1,
        (i & 4) ? 1 : -1,
        (i & 8) ? 1 : -1
      ]);
    }
    const edges = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diff = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices[i][k] !== vertices[j][k]) diff++;
        }
        if (diff === 1) edges.push([i, j]);
      }
    }
    return { vertices, edges };
  }

  // 2. 5-Cell (Pentachoron - 4D Simplex)
  static createCell5() {
    const a = 1 / Math.sqrt(5);
    const vertices = [
      [1, 1, 1, -a],
      [1, -1, -1, -a],
      [-1, 1, -1, -a],
      [-1, -1, 1, -a],
      [0, 0, 0, Math.sqrt(5) - a]
    ];
    const edges = [];
    for (let i = 0; i < 5; i++) {
      for (let j = i + 1; j < 5; j++) {
        edges.push([i, j]);
      }
    }
    return { vertices, edges };
  }

  // 3. 16-Cell (Hexadecachoron - 4D Cross-Polytope)
  static createCell16() {
    const vertices = [
      [ 1, 0, 0, 0], [-1, 0, 0, 0],
      [ 0, 1, 0, 0], [ 0,-1, 0, 0],
      [ 0, 0, 1, 0], [ 0, 0,-1, 0],
      [ 0, 0, 0, 1], [ 0, 0, 0,-1]
    ];
    const edges = [];
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        if (i % 2 === 0 && j === i + 1) continue;
        edges.push([i, j]);
      }
    }
    return { vertices, edges };
  }

  // 4. 24-Cell (Icositetrachoron)
  static createCell24() {
    const vertices = [];
    const cell16Verts = [
      [ 1, 0, 0, 0], [-1, 0, 0, 0],
      [ 0, 1, 0, 0], [ 0,-1, 0, 0],
      [ 0, 0, 1, 0], [ 0, 0,-1, 0],
      [ 0, 0, 0, 1], [ 0, 0, 0,-1]
    ];
    vertices.push(...cell16Verts);

    const s = 1.0;
    for (let i = 0; i < 16; i++) {
      vertices.push([
        ((i & 1) ? 0.5 : -0.5) * s,
        ((i & 2) ? 0.5 : -0.5) * s,
        ((i & 4) ? 0.5 : -0.5) * s,
        ((i & 8) ? 0.5 : -0.5) * s
      ]);
    }

    const edges = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[i][0] - vertices[j][0];
        const dy = vertices[i][1] - vertices[j][1];
        const dz = vertices[i][2] - vertices[j][2];
        const dw = vertices[i][3] - vertices[j][3];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz + dw*dw);
        if (Math.abs(dist - 1.0) < 0.05) {
          edges.push([i, j]);
        }
      }
    }
    return { vertices, edges };
  }

  // 5. 120-Cell
  static createCell120() {
    const phi = (1 + Math.sqrt(5)) / 2;
    const p1 = 1 / phi;
    const p2 = phi;
    const vertices = [];

    for (let i = 0; i < 16; i++) {
      vertices.push([
        (i & 1) ? 1 : -1,
        (i & 2) ? 1 : -1,
        (i & 4) ? 1 : -1,
        (i & 8) ? 1 : -1
      ]);
    }
    
    for (let i = 0; i < 16; i++) {
      const s1 = (i & 1) ? p2 : -p2;
      const s2 = (i & 2) ? p1 : -p1;
      const s3 = (i & 3) ? 1 : -1;
      vertices.push([s1, s2, s3, 0]);
      vertices.push([0, s1, s2, s3]);
    }

    const uniqueVerts = [];
    const threshold = 0.001;
    for (let v of vertices) {
      let exists = false;
      for (let u of uniqueVerts) {
        if (Math.hypot(v[0]-u[0], v[1]-u[1], v[2]-u[2], v[3]-u[3]) < threshold) {
          exists = true; break;
        }
      }
      if (!exists) uniqueVerts.push(v);
    }

    const edges = [];
    for (let i = 0; i < uniqueVerts.length; i++) {
      for (let j = i + 1; j < uniqueVerts.length; j++) {
        const dx = uniqueVerts[i][0] - uniqueVerts[j][0];
        const dy = uniqueVerts[i][1] - uniqueVerts[j][1];
        const dz = uniqueVerts[i][2] - uniqueVerts[j][2];
        const dw = uniqueVerts[i][3] - uniqueVerts[j][3];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz + dw*dw);
        if (dist > 0.8 && dist < 1.25) {
          edges.push([i, j]);
        }
      }
    }
    return { vertices: uniqueVerts, edges };
  }

  // 6. 600-Cell
  static createCell600() {
    const phi = (1 + Math.sqrt(5)) / 2;
    const vertices = [];

    const bases = [
      [2,0,0,0], [-2,0,0,0], [0,2,0,0], [0,-2,0,0],
      [0,0,2,0], [0,0,-2,0], [0,0,0,2], [0,0,0,-2]
    ];
    vertices.push(...bases);

    for (let i = 0; i < 16; i++) {
      vertices.push([
        (i & 1) ? 1 : -1,
        (i & 2) ? 1 : -1,
        (i & 4) ? 1 : -1,
        (i & 8) ? 1 : -1
      ]);
    }

    const p1 = phi;
    const p2 = 1;
    const p3 = 1 / phi;
    const evenPerms = [
      [p1, p2, p3, 0], [p3, p1, p2, 0], [p2, p3, p1, 0],
      [0, p1, p2, p3], [0, p3, p1, p2], [0, p2, p3, p1]
    ];
    for (let perm of evenPerms) {
      for (let s1 of [-1, 1]) {
        for (let s2 of [-1, 1]) {
          for (let s3 of [-1, 1]) {
            vertices.push([perm[0]*s1, perm[1]*s2, perm[2]*s3, perm[3]]);
          }
        }
      }
    }

    const uniqueVerts = [];
    for (let v of vertices) {
      let exists = false;
      for (let u of uniqueVerts) {
        if (Math.hypot(v[0]-u[0], v[1]-u[1], v[2]-u[2], v[3]-u[3]) < 0.01) {
          exists = true; break;
        }
      }
      if (!exists) uniqueVerts.push(v);
    }

    const edges = [];
    for (let i = 0; i < uniqueVerts.length; i++) {
      for (let j = i + 1; j < uniqueVerts.length; j++) {
        const dx = uniqueVerts[i][0] - uniqueVerts[j][0];
        const dy = uniqueVerts[i][1] - uniqueVerts[j][1];
        const dz = uniqueVerts[i][2] - uniqueVerts[j][2];
        const dw = uniqueVerts[i][3] - uniqueVerts[j][3];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz + dw*dw);
        if (dist > 1.1 && dist < 1.35) {
          edges.push([i, j]);
        }
      }
    }
    return { vertices: uniqueVerts, edges };
  }
}

// ==========================================
// 2. 4D ROTATION & PROJECTION ENGINE
// ==========================================

class HyperEngine {
  constructor() {
    this.angles = { xw: 0, yw: 0, zw: 0, xy: 0, xz: 0, yz: 0 };
    this.speeds = { xw: 0.005, yw: 0.003, zw: 0, xy: 0.002, xz: 0, yz: 0 };
    this.isAutoRotating = true;
    this.projectionMode = 'perspective';
    this.wDistance = 2.5;
    this.enableSlice = false;
    this.sliceW = 0.0;
    this.sliceThickness = 0.15;
  }

  rotatePoint4D(pt) {
    let [x, y, z, w] = pt;

    // XW Rotation
    if (this.angles.xw !== 0) {
      const cos = Math.cos(this.angles.xw), sin = Math.sin(this.angles.xw);
      const rx = x * cos - w * sin;
      const rw = x * sin + w * cos;
      x = rx; w = rw;
    }
    // YW Rotation
    if (this.angles.yw !== 0) {
      const cos = Math.cos(this.angles.yw), sin = Math.sin(this.angles.yw);
      const ry = y * cos - w * sin;
      const rw = y * sin + w * cos;
      y = ry; w = rw;
    }
    // ZW Rotation
    if (this.angles.zw !== 0) {
      const cos = Math.cos(this.angles.zw), sin = Math.sin(this.angles.zw);
      const rz = z * cos - w * sin;
      const rw = z * sin + w * cos;
      z = rz; w = rw;
    }
    // XY Rotation
    if (this.angles.xy !== 0) {
      const cos = Math.cos(this.angles.xy), sin = Math.sin(this.angles.xy);
      const rx = x * cos - y * sin;
      const ry = x * sin + y * cos;
      x = rx; y = ry;
    }
    // XZ Rotation
    if (this.angles.xz !== 0) {
      const cos = Math.cos(this.angles.xz), sin = Math.sin(this.angles.xz);
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      x = rx; z = rz;
    }
    // YZ Rotation
    if (this.angles.yz !== 0) {
      const cos = Math.cos(this.angles.yz), sin = Math.sin(this.angles.yz);
      const ry = y * cos - z * sin;
      const rz = y * sin + z * cos;
      y = ry; z = rz;
    }

    return [x, y, z, w];
  }

  projectTo3D(pt4D) {
    const [x, y, z, w] = pt4D;
    if (this.projectionMode === 'perspective') {
      const scale = 1 / (this.wDistance - w);
      return {
        point: new THREE.Vector3(x * scale, y * scale, z * scale),
        w: w,
        scale: scale
      };
    } else {
      return {
        point: new THREE.Vector3(x * 0.6, y * 0.6, z * 0.6),
        w: w,
        scale: 1.0
      };
    }
  }

  updateAngles() {
    if (!this.isAutoRotating) return;
    this.angles.xw += this.speeds.xw;
    this.angles.yw += this.speeds.yw;
    this.angles.zw += this.speeds.zw;
    this.angles.xy += this.speeds.xy;
    this.angles.xz += this.speeds.xz;
    this.angles.yz += this.speeds.yz;
  }
}

// ==========================================
// 3. THREE.JS VIEW RENDERER & APP CONTROLLER
// ==========================================

class App {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.engine = new HyperEngine();
    this.activePolytopeKey = 'tesseract';
    this.polytopeData = null;
    this.vertexSphereScale = 0.04;

    this.touchStartX = 0;
    this.touchStartY = 0;
    this.isMultiTouch = false;

    this.themes = {
      cyberpunk: {
        bg: 0x050814,
        startColor: new THREE.Color(0x00f0ff),
        endColor: new THREE.Color(0xff007f),
        vertexColor: 0x00f0ff
      },
      emerald: {
        bg: 0x02120b,
        startColor: new THREE.Color(0x00ff88),
        endColor: new THREE.Color(0x006633),
        vertexColor: 0x00ff88
      },
      deepspace: {
        bg: 0x020617,
        startColor: new THREE.Color(0x38bdf8),
        endColor: new THREE.Color(0x6366f1),
        vertexColor: 0x38bdf8
      },
      infrared: {
        bg: 0x180505,
        startColor: new THREE.Color(0xffaa00),
        endColor: new THREE.Color(0xff0033),
        vertexColor: 0xffaa00
      },
      monochrome: {
        bg: 0x0f172a,
        startColor: new THREE.Color(0xf8fafc),
        endColor: new THREE.Color(0x475569),
        vertexColor: 0xffffff
      }
    };
    this.currentThemeKey = 'cyberpunk';

    this.frameCount = 0;
    this.lastFpsTime = performance.now();

    this.initThree();
    this.loadPolytope('tesseract');
    this.setupUIListeners();
    this.setupTouchGestures();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.themes[this.currentThemeKey].bg);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 6);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    const grid = new THREE.GridHelper(12, 24, 0x1e293b, 0x0f172a);
    grid.position.y = -2.5;
    this.scene.add(grid);

    this.edgesGroup = new THREE.Group();
    this.verticesGroup = new THREE.Group();
    this.scene.add(this.edgesGroup);
    this.scene.add(this.verticesGroup);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  loadPolytope(key) {
    this.activePolytopeKey = key;
    switch (key) {
      case 'tesseract': this.polytopeData = Geometry4D.createTesseract(); break;
      case 'cell5': this.polytopeData = Geometry4D.createCell5(); break;
      case 'cell16': this.polytopeData = Geometry4D.createCell16(); break;
      case 'cell24': this.polytopeData = Geometry4D.createCell24(); break;
      case 'cell120': this.polytopeData = Geometry4D.createCell120(); break;
      case 'cell600': this.polytopeData = Geometry4D.createCell600(); break;
      default: this.polytopeData = Geometry4D.createTesseract(); break;
    }

    document.getElementById('stat-vertices').textContent = this.polytopeData.vertices.length;
    document.getElementById('stat-edges').textContent = this.polytopeData.edges.length;

    this.buildThreeGeometry();
  }

  buildThreeGeometry() {
    while (this.edgesGroup.children.length > 0) {
      const obj = this.edgesGroup.children.pop();
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }
    while (this.verticesGroup.children.length > 0) {
      const obj = this.verticesGroup.children.pop();
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }

    const edgeCount = this.polytopeData.edges.length;
    const vertCount = this.polytopeData.vertices.length;

    const lineGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(edgeCount * 2 * 3);
    const colors = new Float32Array(edgeCount * 2 * 3);

    lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      linewidth: 2
    });

    this.linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    this.edgesGroup.add(this.linesMesh);

    const sphereGeo = new THREE.SphereGeometry(1, 12, 12);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: this.themes[this.currentThemeKey].vertexColor,
      roughness: 0.2,
      metalness: 0.8,
      emissive: this.themes[this.currentThemeKey].vertexColor,
      emissiveIntensity: 0.4
    });

    this.vertexMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, vertCount);
    this.verticesGroup.add(this.vertexMesh);

    this.dummyTransform = new THREE.Object3D();
  }

  updateRender() {
    this.engine.updateAngles();

    const verts4D = this.polytopeData.vertices;
    const edges = this.polytopeData.edges;
    const theme = this.themes[this.currentThemeKey];

    const projectedVerts = [];
    for (let i = 0; i < verts4D.length; i++) {
      const rotated = this.engine.rotatePoint4D(verts4D[i]);
      const proj = this.engine.projectTo3D(rotated);
      projectedVerts.push(proj);
    }

    const posAttr = this.linesMesh.geometry.attributes.position;
    const colAttr = this.linesMesh.geometry.attributes.color;
    let posIndex = 0;

    for (let i = 0; i < edges.length; i++) {
      const [uIdx, vIdx] = edges[i];
      const p1 = projectedVerts[uIdx];
      const p2 = projectedVerts[vIdx];

      if (this.engine.enableSlice) {
        const wAvg = (p1.w + p2.w) / 2;
        const distToSlice = Math.abs(wAvg - this.engine.sliceW);
        if (distToSlice > this.engine.sliceThickness) {
          posAttr.setXYZ(posIndex, 0, 0, 0);
          posAttr.setXYZ(posIndex + 1, 0, 0, 0);
          posIndex += 2;
          continue;
        }
      }

      posAttr.setXYZ(posIndex, p1.point.x, p1.point.y, p1.point.z);
      posAttr.setXYZ(posIndex + 1, p2.point.x, p2.point.y, p2.point.z);

      const t1 = THREE.MathUtils.clamp((p1.w + 1.2) / 2.4, 0, 1);
      const t2 = THREE.MathUtils.clamp((p2.w + 1.2) / 2.4, 0, 1);

      const c1 = new THREE.Color().copy(theme.startColor).lerp(theme.endColor, t1);
      const c2 = new THREE.Color().copy(theme.startColor).lerp(theme.endColor, t2);

      colAttr.setXYZ(posIndex, c1.r, c1.g, c1.b);
      colAttr.setXYZ(posIndex + 1, c2.r, c2.g, c2.b);

      posIndex += 2;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    for (let i = 0; i < projectedVerts.length; i++) {
      const p = projectedVerts[i];
      
      if (this.engine.enableSlice && Math.abs(p.w - this.engine.sliceW) > this.engine.sliceThickness) {
        this.dummyTransform.scale.set(0, 0, 0);
      } else {
        this.dummyTransform.position.copy(p.point);
        const scale = Math.max(0.001, this.vertexSphereScale * (p.scale || 1.0));
        this.dummyTransform.scale.set(scale, scale, scale);
      }

      this.dummyTransform.updateMatrix();
      this.vertexMesh.setMatrixAt(i, this.dummyTransform.matrix);
    }
    this.vertexMesh.instanceMatrix.needsUpdate = true;

    // Update angle values text displays
    document.getElementById('angle-xw').textContent = (this.engine.angles.xw % (Math.PI * 2)).toFixed(2);
    document.getElementById('angle-yw').textContent = (this.engine.angles.yw % (Math.PI * 2)).toFixed(2);
    document.getElementById('angle-zw').textContent = (this.engine.angles.zw % (Math.PI * 2)).toFixed(2);
    document.getElementById('angle-xy').textContent = (this.engine.angles.xy % (Math.PI * 2)).toFixed(2);
    document.getElementById('angle-xz').textContent = (this.engine.angles.xz % (Math.PI * 2)).toFixed(2);
    document.getElementById('angle-yz').textContent = (this.engine.angles.yz % (Math.PI * 2)).toFixed(2);
  }

  setupTouchGestures() {
    const container = this.container;

    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isMultiTouch = false;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      } else if (e.touches.length > 1) {
        this.isMultiTouch = true;
      }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!this.isMultiTouch && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.touchStartX;
        const deltaY = e.touches[0].clientY - this.touchStartY;

        this.engine.angles.xw += deltaX * 0.008;
        this.engine.angles.yw += deltaY * 0.008;

        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });
  }

  setupUIListeners() {
    const sidebar = document.getElementById('controls-sidebar');
    const overlay = document.getElementById('mobile-overlay');
    const openBtn = document.getElementById('toggle-sidebar-btn');
    const closeBtn = document.getElementById('close-sidebar-btn');

    const openDrawer = () => {
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.remove('hidden');
    };

    const closeDrawer = () => {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    };

    openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    document.getElementById('polytope-select').addEventListener('change', (e) => {
      this.loadPolytope(e.target.value);
    });

    const planes = ['xw', 'yw', 'zw', 'xy', 'xz', 'yz'];
    planes.forEach(plane => {
      const slider = document.getElementById(`rot-${plane}`);
      const valDisplay = document.getElementById(`val-${plane}`);
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.engine.speeds[plane] = val;
        valDisplay.textContent = val.toFixed(3);
      });
    });

    const autoBtn = document.getElementById('toggle-auto-rotate');
    autoBtn.addEventListener('click', () => {
      this.engine.isAutoRotating = !this.engine.isAutoRotating;
      autoBtn.textContent = this.engine.isAutoRotating ? 'PAUSE' : 'RESUME';
      autoBtn.classList.toggle('bg-hyper-cyan/20');
      autoBtn.classList.toggle('bg-slate-700');
    });

    document.getElementById('reset-rotation-btn').addEventListener('click', () => {
      planes.forEach(p => {
        this.engine.angles[p] = 0;
      });
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.target.getAttribute('data-preset');
        if (preset === 'hyper-spin') {
          this.engine.speeds = { xw: 0.015, yw: 0.01, zw: 0.005, xy: 0, xz: 0, yz: 0 };
        } else if (preset === 'flat-slice') {
          this.engine.speeds = { xw: 0.02, yw: 0, zw: 0, xy: 0, xz: 0, yz: 0 };
        } else if (preset === 'chaos-orbit') {
          this.engine.speeds = { xw: 0.012, yw: 0.008, zw: 0.015, xy: 0.005, xz: 0.007, yz: 0.003 };
        }
        planes.forEach(p => {
          const slider = document.getElementById(`rot-${p}`);
          const valDisplay = document.getElementById(`val-${p}`);
          slider.value = this.engine.speeds[p];
          valDisplay.textContent = this.engine.speeds[p].toFixed(3);
        });
      });
    });

    const persBtn = document.getElementById('proj-perspective-btn');
    const orthoBtn = document.getElementById('proj-ortho-btn');
    const projStat = document.getElementById('stat-projection');

    persBtn.addEventListener('click', () => {
      this.engine.projectionMode = 'perspective';
      persBtn.className = "flex-1 py-1 rounded-md bg-hyper-cyan/20 text-hyper-cyan font-semibold transition-all";
      orthoBtn.className = "flex-1 py-1 rounded-md text-slate-400 hover:text-slate-200 transition-all";
      projStat.textContent = '4D-PERSPECTIVE';
    });

    orthoBtn.addEventListener('click', () => {
      this.engine.projectionMode = 'orthographic';
      orthoBtn.className = "flex-1 py-1 rounded-md bg-hyper-cyan/20 text-hyper-cyan font-semibold transition-all";
      persBtn.className = "flex-1 py-1 rounded-md text-slate-400 hover:text-slate-200 transition-all";
      projStat.textContent = '4D-ORTHO';
    });

    const sliceToggle = document.getElementById('enable-slice-toggle');
    const sliceControls = document.getElementById('slice-controls');
    sliceToggle.addEventListener('change', (e) => {
      this.engine.enableSlice = e.target.checked;
      if (e.target.checked) {
        sliceControls.classList.remove('opacity-50', 'pointer-events-none');
      } else {
        sliceControls.classList.add('opacity-50', 'pointer-events-none');
      }
    });

    const sliceWSlider = document.getElementById('slice-w-slider');
    sliceWSlider.addEventListener('input', (e) => {
      this.engine.sliceW = parseFloat(e.target.value);
      document.getElementById('val-slice-w').textContent = this.engine.sliceW.toFixed(2);
    });

    const sliceThickSlider = document.getElementById('slice-thick-slider');
    sliceThickSlider.addEventListener('input', (e) => {
      this.engine.sliceThickness = parseFloat(e.target.value);
      document.getElementById('val-slice-thick').textContent = this.engine.sliceThickness.toFixed(2);
    });

    const wDistSlider = document.getElementById('slider-w-dist');
    wDistSlider.addEventListener('input', (e) => {
      this.engine.wDistance = parseFloat(e.target.value);
      document.getElementById('val-w-dist').textContent = this.engine.wDistance.toFixed(2);
    });

    document.getElementById('theme-select').addEventListener('change', (e) => {
      this.currentThemeKey = e.target.value;
      this.scene.background = new THREE.Color(this.themes[this.currentThemeKey].bg);
      this.buildThreeGeometry();
    });

    document.getElementById('slider-vertex-size').addEventListener('input', (e) => {
      this.vertexSphereScale = parseFloat(e.target.value);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsTime >= 1000) {
      document.getElementById('fps-counter').textContent = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = now;
    }

    this.controls.update();
    this.updateRender();
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
