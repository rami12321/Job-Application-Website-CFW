import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animated-stat',
  standalone: true,
  imports: [],
  templateUrl: './animated-stat.component.html',
  styleUrl: './animated-stat.component.css'
})
export class AnimatedStatComponent implements OnInit{
  totalRegistered: number = 0;
  dailyVisitors: number = 0;
  opportunitiesPosted: number = 0;
  activeProjects: number = 0;

  ngOnInit() {
    this.animateValue('totalRegistered', 0, 692, 2000); // Replace 5000 with actual total registered count
    this.animateValue('dailyVisitors', 0, 160, 2000); // Replace 300 with actual daily visitor count
    this.animateValue('opportunitiesPosted', 0, 150, 2000); // Replace 150 with actual opportunities
    this.animateValue('activeProjects', 0, 50, 2000); // Replace 50 with actual active projects
  }

  animateValue(property: 'totalRegistered' | 'dailyVisitors' | 'opportunitiesPosted' | 'activeProjects', start: number, end: number, duration: number) {
    const range = end - start;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    const increment = end > start ? 1 : -1;

    const timer = setInterval(() => {
      current += increment;
      this[property] = current;
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);
  }
}
