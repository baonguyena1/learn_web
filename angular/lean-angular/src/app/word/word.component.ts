import {Component } from '@angular/core';

@Component({
    selector: 'app-word',
    templateUrl: './word.component.html',
    styleUrls: ['./word.component.css']
})

export class WordComponent {
    en = 'Hello';
    vn = 'Xin chao';
    imageUrl = '../../favicon.ico';
    forgot = false;
    name = '';

    toggleForgot() {
        this.forgot = !this.forgot;
    }

    showEvent(event) {
        this.name = event.target.value;
    }
}