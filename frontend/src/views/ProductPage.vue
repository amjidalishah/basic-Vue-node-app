<template>
  <div class="overflow-x-auto">
    <div class="mt-5">
      <form @submit.prevent="submitForm">
        <div class="flex align-center mb-3">
          <input
            v-model="formData.title"
            type="text"
            id="title"
            name="title"
            required
            placeholder="Title"
            class="border rounded p-2 mr-2"
          />

          <textarea
            v-model="formData.description"
            id="description"
            name="description"
            rows="1"
            required
            placeholder="Description"
            class="border rounded p-2 mr-3"
          ></textarea>
          <button
            type="submit"
            class="rounded bg-blue-500 text-white py-2 px-4"
          >
            Create Record
          </button>
        </div>
      </form>
    </div>
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">ID</th>
          <th class="py-2 px-4 border-b">Title</th>
          <th class="py-2 px-4 border-b">Description</th>
          <th class="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in products.data" :key="index">
          <td class="py-2 px-4 border-b">{{ index + 1 }}</td>
          <td class="py-2 px-4 border-b">{{ item.title }}</td>
          <td class="py-2 px-4 border-b">{{ item.description }}</td>
          <td class="py-2 px-4 border-b">
            <button
              @click="editRecord(index)"
              class="bg-blue-500 rounded text-white py-1 px-2 mr-2"
            >
              Edit
            </button>
            <button
              @click="deleteRecord(item._id)"
              class="bg-red-500 rounded text-white py-1 px-2"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores";
import { ref, computed } from "vue";

const productStore = useProductStore();
const { products } = storeToRefs(productStore);

const formData = ref({
  _id: "",
  title: "",
  description: "",
});

productStore.getAllProducts();

let editingIndex = null;

const submitForm = async () => {
  if (editingIndex !== null) {
    // Update existing record
    await productStore.updateProduct({
      productId: products.value.data[editingIndex]._id,
      productData: formData.value,
    });
    editingIndex = null; // Reset editingIndex after updating
  } else {
    // Create new record
    await productStore.createProduct(formData.value);
  }
  await productStore.getAllProducts();
  formData.value = { title: "", description: "" };
};

const editRecord = (index) => {
  formData.value = { ...products.value.data[index] };
  editingIndex = index;
};

const deleteRecord = async (productId) => {
  const shouldDelete = window.confirm(
    "Are you sure you want to delete this record?"
  );
  if (shouldDelete) {
    // User confirmed deletion
    await productStore.deleteProduct(productId);
    await productStore.getAllProducts();
  }
};
</script>
