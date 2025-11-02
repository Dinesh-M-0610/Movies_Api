
# Node.js with Express API

This project is a Node.js application using the Express framework. It provides a RESTful API for managing movies and users.

## API Routes

Below is a list of all the available API routes and their corresponding `curl` commands.

### Authentication Routes

*   **Sign up**

    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"name":"test","email":"test@test.com","password":"test1234","confirmPassword":"test1234"}' http://localhost:3000/api/v1/users/signup
    ```

*   **Log in**

    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test1234"}' http://localhost:3000/api/v1/users/login
    ```

*   **Forgot Password**

    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com"}' http://localhost:3000/api/v1/users/forgotPassword
    ```

*   **Reset Password**

    ```bash
    curl -X PATCH -H "Content-Type: application/json" -d '{"password":"newpassword","confirmPassword":"newpassword"}' http://localhost:3000/api/v1/users/resetPassword/your_reset_token
    ```

*   **Update Password**

    ```bash
    curl -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer your_jwt_token" -d '{"currentPassword":"test1234","password":"newpassword","confirmPassword":"newpassword"}' http://localhost:3000/api/v1/users/updatePassword
    ```

### Movie Routes

*   **Get Highest Rated Movies**

    ```bash
    curl http://localhost:3000/api/v1/movies/highest-rated
    ```

*   **Get Movie Stats**

    ```bash
    curl http://localhost:3000/api/v1/movies/movie-stats
    ```

*   **Get Movie by Genre**

    ```bash
    curl http://localhost:3000/api/v1/movies/movie-by-genre/your_genre
    ```

*   **Get All Movies**

    ```bash
    curl -H "Authorization: Bearer your_jwt_token" http://localhost:3000/api/v1/movies
    ```

*   **Create Movie**

    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer your_jwt_token" -d '{"name":"New Movie","genre":"Action","duration":120,"ratings":4.5}' http://localhost:3000/api/v1/movies
    ```

*   **Get Movie by ID**

    ```bash
    curl -H "Authorization: Bearer your_jwt_token" http://localhost:3000/api/v1/movies/your_movie_id
    ```

*   **Update Movie**

    ```bash
    curl -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer your_jwt_token" -d '{"ratings":4.8}' http://localhost:3000/api/v1/movies/your_movie_id
    ```

*   **Delete Movie**

    ```bash
    curl -X DELETE -H "Authorization: Bearer your_jwt_token" http://localhost:3000/api/v1/movies/your_movie_id
    ```

### User Routes (Admin)

*   **Get All Users**

    ```bash
    curl -H "Authorization: Bearer your_admin_jwt_token" http://localhost:3000/api/v1/admin/users
    ```

*   **Get User by ID**

    ```bash
    curl -H "Authorization: Bearer your_admin_jwt_token" http://localhost:3000/api/v1/admin/users/your_user_id
    ```

*   **Update User**

    ```bash
    curl -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer your_admin_jwt_token" -d '{"role":"admin"}' http://localhost:3000/api/v1/admin/users/your_user_id
    ```

*   **Delete User**

    ```bash
    curl -X DELETE -H "Authorization: Bearer your_admin_jwt_token" http://localhost:3000/api/v1/admin/users/your_user_id
    ```
