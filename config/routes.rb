Rails.application.routes.draw do
  resources :maps
  resources :homes
  get 'home/index'

  get 'home/modify'

  post 'home/index/:id' => 'home#index'

  post 'home/index'

  post 'home/modify'




  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'home#modify'
end
