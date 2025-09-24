import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>🚀 Angular 20 NgRx Redux Example</h1>
        <p>Gestione state con NgRx, Pokemon API e paginazione - Aggiornato ad Angular 20</p>
      </header>
      
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="app-footer">
        <p>💡 Demo completa NgRx: Actions, Reducers, Effects, Selectors, Entity Adapter, Guards & Testing</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .app-header {
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .app-header h1 {
      margin: 0;
      color: #333;
      font-size: 2.5rem;
    }
    
    .app-header p {
      margin: 10px 0 0;
      color: #666;
      font-size: 1.1rem;
    }
    
    .app-main {
      padding: 0;
    }
    
    .app-footer {
      background: rgba(0, 0, 0, 0.8);
      color: white;
      text-align: center;
      padding: 15px;
      margin-top: 50px;
    }
    
    .app-footer p {
      margin: 0;
      font-size: 14px;
    }
  `]
})
export class AppComponent {
  title = 'Angular 20 NgRx Redux Pokemon Example';
}
