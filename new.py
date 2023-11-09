import boto3

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')

# Specify the table name
table_name = 'face_recognition'

# Get the table
table = dynamodb.Table(table_name)

# Get all items from the table
response = table.scan()

# Print the items
for item in response['Items']:
    print(item)
    #delete all items
    table.delete_item(Key={'RekognitionId': item['RekognitionId']})

