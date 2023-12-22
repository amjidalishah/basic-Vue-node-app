<template>
  <div class="overflow-x-auto">
    <div class="mt-5">
      <form @submit.prevent="submitForm">
        <div class="flex align-center mb-3">
          <input
            v-model="formData.username"
            type="text"
            id="userName"
            name="userName"
            required
            placeholder="User Name"
            class="border rounded p-2 mr-2"
          />

          <input
            v-model="formData.email"
            id="Email"
            name="Email"
            required
            placeholder="Email"
            class="border rounded p-2 mr-2"
          />
          <input
            v-if="!isUpdateMode"
            v-model="formData.password"
            id="password"
            name="password"
            required
            type="password"
            placeholder="password"
            class="border rounded p-2 mr-3"
          />
          <button
            type="submit"
            class="rounded bg-blue-500 text-white py-2 px-4"
          >
            {{ isUpdateMode ? "Update Record" : "Create Record" }}
          </button>
        </div>
      </form>
    </div>
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">ID</th>
          <th class="py-2 px-4 border-b">User Name</th>
          <th class="py-2 px-4 border-b">Email</th>
          <th class="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in users.data" :key="index">
          <td class="py-2 px-4 border-b">{{ index + 1 }}</td>
          <td class="py-2 px-4 border-b">{{ item.username }}</td>
          <td class="py-2 px-4 border-b">{{ item.email }}</td>
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
import { useUserStore } from "@/stores";
import { ref, computed } from "vue";
const userStore = useUserStore();

userStore.getAllUsers();

const { users } = storeToRefs(userStore);

const formData = ref({
  _id: "",
  email: "",
  username: "",
  password: "",
});

const editingIndex = ref(null);
const isUpdateMode = computed(() => editingIndex.value !== null);

const submitForm = async () => {
  if (editingIndex.value !== null) {
    // Update existing record
    await userStore.updateUser({
      userId: users.value.data[editingIndex.value]._id,
      userData: formData.value,
    });
    editingIndex.value = null; // Reset editingIndex after updating
  } else {
    // Create new record
    await userStore.createUser(formData.value);
  }
  await userStore.getAllUsers();
  formData.value = { title: "", description: "" };
};

const editRecord = (index) => {
  formData.value = { ...users.value.data[index] };

  editingIndex.value = index;
};

const deleteRecord = async (productId) => {
  const shouldDelete = window.confirm(
    "Are you sure you want to delete this record?"
  );
  if (shouldDelete) {
    // User confirmed deletion
    await userStore.deleteUser(productId);
    await userStore.getAllUsers();
  }
};
</script>
