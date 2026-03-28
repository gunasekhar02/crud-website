import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService, Item } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {
  items: Item[] = [];
  newItemName = '';
  editingId: number | null = null;
  editingName = '';
  error = '';
  success = '';
  isLoading = false;

  constructor(
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.itemService.getItems().subscribe({
      next: (data: Item[]) => {
        this.items = data;
      },
      error: (err: any) => {
        this.error = 'Unable to load items';
      }
    });
  }

  addItem() {
    if (!this.newItemName.trim()) {
      this.error = 'Please enter item name';
      return;
    }

    this.itemService.addItem({ name: this.newItemName }).subscribe({
      next: () => {
        this.success = 'Item added successfully';
        this.newItemName = '';
        this.loadItems();
        setTimeout(() => this.success = '', 2000);
      },
      error: (err: any) => {
        this.error = 'Unable to add item';
      }
    });
  }

  editItem(id: number, name: string) {
    this.editingId = id;
    this.editingName = name;
  }

  saveEdit(id: number) {
    if (!this.editingName.trim()) {
      this.error = 'Please enter item name';
      return;
    }

    this.itemService.editItem(id, { name: this.editingName }).subscribe({
      next: () => {
        this.success = 'Item updated successfully';
        this.editingId = null;
        this.loadItems();
        setTimeout(() => this.success = '', 2000);
      },
      error: (err: any) => {
        this.error = 'Unable to update item';
      }
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editingName = '';
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.deleteItem(id).subscribe({
        next: () => {
          this.success = 'Item deleted successfully';
          this.loadItems();
          setTimeout(() => this.success = '', 2000);
        },
        error: (err: any) => {
          this.error = 'Unable to delete item';
        }
      });
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.error = 'Logout failed';
      }
    });
  }
}
